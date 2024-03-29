---
layout: post
title: Running instances in a private subnet on Amazon EC2
excerpt: How to run instances in a private subnet on Amazon EC2, whilst retaining internet connectivity for deploys and updates.
---

For a while now, I'm been meaning to look into how best to setup [EC2][ec2] instances on [Amazon's][amazon] cloud
computing platform [AWS][aws] in a private subnet. In this post, I aim to explain how best to build a setup where your
"frontend" web server(s) or load balancer(s) are situated in a publicly accessible subnet and your application nodes
are in a private subnet that is not internet accessible.

### Overview
This setup is just one example of a security best practice and there are many, many other steps that you should take to
ensure the security of your stack. This particular practice ensures that the only part of your setup that is public
facing is a thin, dumb layer. This layer is usually in the form of a [load balancer][load-balancer] but can just be a
simple [reverse proxying][reverse-proxy] web server passing traffic between the untrusted public domain to the trusted
domain of the private subnet where your application servers are situated.

<img class="app-load-balancer" alt="An example setup" src="/assets/img/posts/running-instances-in-a-private-subnet-on-amazon-ec2/app-load-balanced.png" />

The idea being: you *must* have an opening on to the internet, so let attackers do what they want with your public
facing load balancer. If they want to kill it, DDOS it, or whatever - it's a throw away instance that does nothing
more than passing data between two interfaces and therefore can be terminated and a newly built (and security patched)
instance can be put in it's place without taking the application servers down. What's more: an attacker does not have
direct access to your app servers from the internet - they only get direct access to your load balancer or reverse
proxy which is much more secure. Again, this doesn't garauntee an attacker won't hop from the load balancer onto the
app server, but this can be mitigated with different users, SSH keys, etc. between the public subnet and the private
subnet. This is a little out of the scope of this post, though!

Now, let's get back on topic!

### [Amazon VPC][amazon-vpc]
[Amazon VPC][amazon-vpc] is where we will carry out most of the work. It's where you configure and manage you virtual
network on AWS' infrastructure and it's the network where your EC2 instances will run.

<img class="vpc-screenshot" alt="The VPC interface" src="/assets/img/posts/running-instances-in-a-private-subnet-on-amazon-ec2/vpc-screenshot.png" />

#### VPCs
Login to AWS and load up the [VPC Dashboard][amazon-vpc]. Although it would be best to create a new VPC for the
purposes of this post, we will be building our setup in the default VPC of your AWS account. If I'm not
mistaken, AWS accounts automatically get a VPC setup for them out-of-the-box. Click "VPCs" in the VPC dashboard and
make sure that you've got at least one VPC setup and ready to go!

If you've not got a VPC there, consult the [AWS documentation][aws-docs-vpc] on how to set one up.

Whilst I'm writing this post, I'm using a test VPC called `test` and I've configured to cover the IP range `10.0.0.0/16`.

#### Internet gateway
Next, we need to create an internet gateway. Think of this as your internet connection at home plugging into the back
of your home router.

In the left of the VPC interface, click "Internet Gateways", then click "Create Internet Gateway". We'll call this
`test-gateway`, because it's well, a test! When that's been created, it should show up with a state of *detached*. Select
it from the list then click the "Attach to VPC" button above. Select your VPC from the dropdown and click "Yes, Attach".
In a few moments, your internet gateway should show as attached!

#### Subnets
Next up: Subnets! In the left of the AWS interface, under "Virtual Private Cloud", hit "Subnets". When the page loads,
you should see all the subnets in all of your VPCs.

First, we're going to create our <span class="warn">public subnet</span>. This subnet is where we will place our load balancer and will therefore
be publically accessible (firewalled, of course). Hit "Create Subnet" and name this new subnet "public". If you
created a new VPC for testing, select it in the VPC field below. For the [CIDR][cidr] block, select a subnet in the range that
your VPC covers. For example, I created a VPC covering `10.0.0.0/16`. That means I'm free to use anything between `10.0.0.0`
and `10.0.254.0` for my subnets. In this example, I will suggest that you use a [CIDR][cidr] block for this subnet of `10.0.0.0/24`.
You can leave the "Availability Zone" option on the default of "No Preference".

When your public subnet has been created, hit "Create Subnet" again and we will create our <span class="success">private subnet</span> where our
application servers will run. Enter the name "private", select your VPC and enter a [CIDR][cidr] block that does not overlap
with any of your other subnets. In the example I gave above, we could use `10.0.1.0/24` for this subnet.


#### Route Tables
You should now have (at least) two subnets in your VPC: one <span class="warn">"public"</span> and one <span class="success">"private"</span>. We now need to give the "public"
subnet internet connectivity. Select the <span class="warn">"public"</span> subnet and click the "Route Table" tab. Below, the route table's ID
should be displayed and this should link you to the "Route Tables" configuration screen for this table in the VPC
interface. Click that link to be taken there. Select the route table in the table of results, then in the view below,
click the "Edit" button which should allow you to edit the route table.

Click the "Add another route" button and a new row in the table should show up. Fill in the details as follows:

* Destination: `0.0.0.0/0`
* Target: `test-gateway` (As you enter this, you should be able to select the `igw-a1b2c3` style ID of the gateway)

Click the "Save" button.

We now want to create a new route table for our private subnet. Click "Create Route Table" and call it "private",
making sure that you've selected the correct VPC for your account. In the "Route Tables" screen, you should now have at
least two route tables and one of them should be called "private". Select this route table from the list and then click
"Subnet Associations" in the view below. Click "Edit" and then tick the box under "Associate" alongside the
<span class="success">"private"</span> subnet, which we created earlier. Hit the "Save" button to apply our changes.

#### NAT Gateway
In it's current state, if we were to launch an EC2 instance in the <span class="success">"private"</span> subnet, the
instance would not be able to connect to the internet. This is great from a security perspective and you may want to be
super secure, but it makes things hard when you want to deploy to the instance and part of that deploy pulls down code
from a GitHub repository, or you want to install the latest OS updates and security patches.

To fix this, we need to setup a [NAT Gateway][aws-nat-gateway] to provide secure access to the outside world. In fact,
this is just what your home router does. You may wish to read more on [NAT][nat] and [Amazon's NAT Gateways][aws-nat-gateway] if you want to
understand what they do and how they work. Note that this is not the same as the [Internet Gateway](#internet-gateway)
that we setup for our <span class="warn">"public"</span> subnet earlier! Whilst they provide internet connectivity,
they do it in different ways.

With that explained, let's proceed with the tutorial and click on "NAT Gateways" in the left hand side of the VPC
interface. Click "Create NAT Gateway". In the modal that pops up, enter your <span class="warn">"public"</span> subnet into the "Subnet" field
and then click "Create NEW EIP" then "Create NAT Gateway". You should get the following note displayed:

> Note: In order to use your NAT gateway, ensure that you edit your route tables to include a route with a target of 'nat-q1w2e3r4t5y6'.

Hit the "Edit Route Tables" button to be taken to your route tables screen. Select the [route table we created earlier](#route-tables)
and then click the "Routes" tab below. Hit the "Edit" button, then click the "Add another route" button and a new row
in the table should show up. Fill in the details as follows:

* Destination: `0.0.0.0/0`
* Target: `nat-q1w2e3r4t5y6` (As you begin to enter this, you should be able to select the NAT gateway from the dropdown
list, to save you entering the ID letter by letter)

Hit "Save" and that's it in the VPC interface! Give yourself a pat on the back, make yourself a coffee or something
rewarding - you did good! :smile: :coffee:

### Amazon EC2
Now, all that remains is to launch an instance into your new <span class="warn">"public"</span> and
<span class="success">"private"</span> subnets. Head into [EC2][ec2] and click "Launch Instance". Choose your
favourite flavour OS (Linux, I hope! :wink:); I just went for Amazon Linux as I was being lazy and couldn't be
bothered finding a CentOS AMI.

<img class="ec2-screenshot" alt="The EC2 interface" src="/assets/img/posts/running-instances-in-a-private-subnet-on-amazon-ec2/ec2-screenshot.png" />

When launching the instance, care needs to be taken on the "Configure Instance Details" screen. Select the correct VPC
in the "Network" dropdown, select the <span class="warn">"public"</span> subnet and enable "Auto-assign Public IP" as we need this instance to
be accessible from the internet and therefore requires a public IP to be assigned to it. Other than that, continue to
launch the instance with your usual configuration. Make a note of the public IP address that get's assigned to the
instance.

After that, we need to launch another instance into the <span class="success">"private"</span> subnet, which will serve the role of the application
server in this example setup. Hit the "Launch Instance" button once more and again: take care on the "Configure
Instance Details" screen. Here, you need to select the correct VPC in the "Network" dropdown, select the <span class="success">"private"</span>
subnet and do not enable "Auto-assign Public IP". Launch the instance and make a note of the internal IP address that
EC2 assigns the instance when it's been created.

You should now have two instances running; one in the <span class="warn">"public"</span> subnet and another in the <span class="success">"private"</span> subnet. You should be
able to SSH onto the instance in the <span class="warn">"public"</span> instance, but not to the instance in the <span class="success">"private"</span> subnet.

### Testing
SSH on to the instance in the <span class="warn">"public"</span> subnet. As this instance is in the same VPC as the other instance which is on a
<span class="success">"private"</span> subnet, you should be able to SSH from the <span class="warn">"public"</span> instance to the <span class="success">"private"</span>. Once you're onto the <span class="success">"private"</span>
instance, you should then be able to access resources on the internet. For example, you can test your internet
connectivity by pinging Google's DNS servers:

{% highlight bash %}
ping 8.8.8.8
{% endhighlight %}

...and you should see replies!

<pre>
PING 8.8.8.8 (8.8.8.8): 56 data bytes
64 bytes from 8.8.8.8: icmp_seq=0 ttl=51 time=18.795 ms
64 bytes from 8.8.8.8: icmp_seq=1 ttl=51 time=19.609 ms
64 bytes from 8.8.8.8: icmp_seq=2 ttl=51 time=19.644 ms

--- 8.8.8.8 ping statistics ---
3 packets transmitted, 3 packets received, 0.0% packet loss
round-trip min/avg/max/stddev = 18.795/19.349/19.644/0.392 ms
</pre>

Hit `Ctrl + C` to cancel that ping.

Your internet connectivity on this <span class="success">"private"</span> instance will be routed through the [NAT Gateway](#nat-gateway) that we created earlier.
You can see this if you get your public IP address whilst logged into the instance:

{% highlight bash %}
curl icanhazip.com
{% endhighlight %}

...and that will return your current public IP. Note that this is different to the IP address of the publicly accessible instance that
you're connected through as this is a different internet gateway than the [NAT Gateway](#nat-gateway).

### Summary

So, there's a lot to take in there! Here's a recap of what we've achieved:

* We created a new VPC.
* We created two VPC subnets:
  * One <span class="warn">"public"</span> where our public facing load balancer will be situated.
  * Another <span class="success">"private"</span> subnet, where our more vulnerable and valuable app servers will be situated.
* We created a route table for the <span class="success">"private"</span> subnet, that routed traffic destined for the internet through a NAT Gateway.
* We created a NAT gateway that will allow our private servers to access the internet securely without exposing them to the internet.
* We launched two EC2 instances:
  * One publicly accessible on the <span class="warn">"public"</span> subnet: Demonstrates a load balancer in this example.
  * One situated on the <span class="success">"private"</span> subnet: Demonstrates the app server.

In the setup that we built, one can connect to the public instance directly over the internet, just like a user's
browser would be able to connect to it using HTTP directly over the internet. However, one cannot connect to the
private instance, unless you are connecting from an instance which is situated in the same VPC as the private instance.
In this example, the load balancer has an interface in that VPC and can therefore connect to the private instance to
forward HTTP connections onto it without exposing the private instance to the internet. At the same time, both
instances have full outbound internet connectivity; allowing code to be deployed to the instances, along with OS
and application updates, installation and downloads.
  
I hope this has helped; it took me a fair bit of trial and error to work out how to do this. If this has helped,
please let me know!

[aws]: https://aws.amazon.com/
[amazon-vpc]: https://console.aws.amazon.com/vpc/
[ec2]: https://console.aws.amazon.com/ec2/
[amazon]: https://www.amazon.co.uk/
[aws-docs-vpc]: https://aws.amazon.com/documentation/vpc/
[cidr]: https://en.wikipedia.org/wiki/Classless_Inter-Domain_Routing
[aws-nat-gateway]: https://docs.aws.amazon.com/AmazonVPC/latest/UserGuide/vpc-nat-gateway.html
[nat]: https://en.wikipedia.org/wiki/Network_address_translation
[load-balancer]: https://en.wikipedia.org/wiki/Load_balancing_(computing)
[reverse-proxy]: https://en.wikipedia.org/wiki/Reverse_proxy
