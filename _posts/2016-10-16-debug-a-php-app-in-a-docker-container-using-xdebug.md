---
layout: post
title: Debug a PHP app in a Docker container with Xdebug
excerpt: Docker is awesome, but this was a pain to setup!
---

Recently, I decided that I was going to learn more about [Docker][docker-site]. I've heard so many good things about
Docker over the past year or so, I figured I best take a look and decide for myself whether it was something I should
integrate into my workflow. In the past 6 months, [Docker for Mac has been released][docker-for-mac-release-post] too,
so this really sparked my interest.

I was pleasantly surprised by how easy it was to get started with Docker. It felt very much like starting to learn Git.
It was so easy in fact, I began containerising all of my local development environments in order to expose myself to
Docker more, allowing me to learn more as I went along.

In next to no time, I'd containerised most of the apps that I work on and I'd even built several multi-container
environments with Docker Compose (see [here][docker-compose-example-1] and [here][docker-compose-example-2]), which is
a really cool tool! Unfortunately, I faced a small but annoying complication with Docker when I wanted to containerise
a PHP app.

I'm a big fan of the [JetBrains IDEs][jetbrains-ides], so my IDE of choice when working with PHP apps is
[PhpStorm][phpstorm-site]. One of the features of PhpStorm is the integrated debugger, allowing you to debug your apps
right from within the code base.

Usually, when setting a up a LAMP development environment, I'll setup [Xdebug][xdebug] too. Xdebug uses the DBGp
protocol to provide interactive debug sessions. For a PHP web app, roughly speaking the process is this:
 
 * Browser submits a request to the server (sometimes including a special GET parameter in the query string to start
 the debugging session)
 * The server (running PHP with the Xdebug module loaded) attempts to connect to the host running the IDE (usually port
 9000 TCP) where an Xdebug client is listening for connections.
 * The IDE responds with commands that instruct Xdebug to continue execution of the code and commands to interrupt the
 execution of code at predefined breakpoints which are easily set my the developer right inside the editor window.
 
The configuration required for Xdebug is something like this:
 
```ini
[xdebug]
xdebug.remote_enable=On
xdebug.remote_autostart=On
```
 
Usually when developing, the LAMP stack is running in a local environment on `localhost`. This means that when the
request is received by the web server (we'll assume Apache here), Xdebug can simply connect back to `localhost` to the
Xdebug client in the IDE.

When the LAMP stack is running in a container though, [Docker's network stack][docker-networking] sits between the running processes inside
the container and the host machine that's running Docker Machine. This means that when I run a web server in a
container, then open that site in my browser, the web server inside the container will see that the request originated
from a host with an IP like `172.17.0.1` which is the IP address of the host (Mac in my case) on the virtual network
stack that Docker runs on the host.
 
If we look back up to how Xdebug works, the Xdebug module will need to connect back to the IDE on `172.17.0.1`,
using port 9000. Sadly, Docker for Mac doesn't currently allow access to the host on this IP address from within the
container. This appears to be a known issue, mentioned [here][docker-for-mac-network-known-issues].

For example:

* Run a simple demo app in a container:

```bash
docker run -it --rm --name php-demo -p 8080:80 php-web-app-debug-demo
```

```
AH00558: apache2: Could not reliably determine the server's fully qualified domain name, using 172.17.0.2. Set the 'ServerName' directive globally to suppress this message
AH00558: apache2: Could not reliably determine the server's fully qualified domain name, using 172.17.0.2. Set the 'ServerName' directive globally to suppress this message
[Sun Oct 16 11:16:37.528569 2016] [mpm_prefork:notice] [pid 1] AH00163: Apache/2.4.10 (Debian) PHP/5.6.26 configured -- resuming normal operations
[Sun Oct 16 11:16:37.528660 2016] [core:notice] [pid 1] AH00094: Command line: 'apache2 -D FOREGROUND'
```

* Then try to access it:

```bash
curl localhost:8080
```

* We see the request logged from `172.17.0.1`:

```
172.17.0.1 - - [16/Oct/2016:11:26:25 +0000] "GET / HTTP/1.1" 200 321 "-" "curl/7.49.1"
```

* If we try and connect back to the host running the IDE with Xdebug client from inside the container:

```bash
telnet 172.17.0.1 9000
```

```
Trying 172.17.0.1...
telnet: Unable to connect to remote host: Connection refused
```
  
We're left in a sticky situation: we need to connect back to the IDE running on the Docker host from Xdebug running
inside the container, but there doesn't seem to be a way to access it. There are a couple of networking options that
are available for running a container under, but none of them seem to alleviate this issue.
  
I was able to find that whilst Docker containers are unable to connect back to the host through the NATed interface
(`172.17.x.x`), they are able to communicate with the host using the LAN IP of the host, which is usually a DHCP
address issued by your home or office router/network infrastructure. For example, my Mac is running on my home network
and my router has issued it the address `192.168.1.66`. From within a container, I can connect back to PhpStorm running
the Xdebug client on port 9000 just fine!

```bash
telnet 192.168.1.66 9000
```

```
Trying 192.168.1.66...
Connected to 192.168.1.66.
Escape character is '^]'.
```

However, this isn't ideal. The address above is different for everyone and in order for Xdebug inside the container to
work, it needs to be told to connect back to the same IP that the request originated from, or it needs to be explicitly
told what address to connect to. This configuration will be baked into the image but if I enter my current IP address,
next time I launch a container from this instance I might have a different IP or someone else might launch a container
from the same image and Xdebug won't work for them until they find out their IP, drop into a shell in the container and
change the Xdebug configuration, etc. This all detracts from one of the biggest advantages to using Docker: portability.

So far, the best solution I have been able to find is to use an arbitrary hostname in the Xdebug configuration and
provide the value to this hostname on launching the container. This can be achieved using the following Xdebug configuration:


```ini
[xdebug]
xdebug.remote_enable=On
xdebug.remote_autostart=On
xdebug.remote_connect_back=Off
xdebug.remote_host=docker_host
```

Rebuild the image with the above config included, then launch the container like so:

```bash
# Replace 192.168.1.66 with your actual LAN IP address
docker run -it --rm --name php-demo -p 8080:80 --add-host="docker_host:192.168.1.66" php-web-app-debug-demo
```

With that in place, you should be able to set some breakpoints in yur PHP code, tell PhpStorm to listen for debug
connections, then request the site in your browser and be good to go!
 
I've thrown together a quick demo of this. The repo holding the source can be found [here][demo-repo] and you can pull a Docker
image containing a working Xdebug setup:

```bash
# Replace 192.168.1.66 with your actual LAN IP address
docker run -it --rm --name php-demo -p 8080:80 --add-host="docker_host:192.168.1.66" masterroot24/php-web-app-debug-demo
```

If you have any questions on the above, or if you've got a better way of doing this, please let me know in the comments
below!

### Update

Since writing this post, I've found that the issue around connecting back to the Docker host isn't possible out of the
box.

The issue with the above workaround is that it's dependent on a potentially ever changing IP address. Another issue is
that you may not have LAN IP address, for example you're not connected to any networks and are working offline.

The [Docker for Mac network notes][docker-for-mac-network-notes] mention the known issues with Docker for Mac and in there, there's a suggestion to add
an alias address to the `lo0` interface on your Mac. `lo0` is a loopback interface that's always available on your Mac,
regardless of whether or not you're connected to a WiFi network. If you're not connected to a network, you can use the
above workaround I've talked about, but instead of using the LAN address, use a new loopback alias address, which is
created like so:

```bash
sudo ifconfig lo0 alias 10.200.10.1/24
```

Then create a container, passing in the new IP address you just added to the loopback interface:

```bash
docker run -it --rm --name php-demo -p 8080:80 --add-host="docker_host:10.200.10.1" masterroot24/php-web-app-debug-demo
```

It's still annoying that we can't just use the [`xdebug.remote_connect_back`][xdebug-connect-back], but it seems to be
a known issue to the Docker for Mac team, so hopefully there may be a better solution in the future when the Docker
networking implementation on Macs improves.

[docker-site]: https://www.docker.com
[demo-repo]: https://github.com/MasterRoot24/docker-php-webapp-debug-demo
[docker-for-mac-release-post]: https://blog.docker.com/2016/07/docker-for-mac-and-windows-production-ready/
[docker-compose-example-1]: https://github.com/MasterRoot24/docker-compose-test
[docker-compose-example-2]: https://github.com/MasterRoot24/docker-compose-wordpress-test
[phpstorm-site]: https://www.jetbrains.com/phpstorm/
[jetbrains-ides]: https://www.jetbrains.com/products.html?fromMenu#type=ide
[xdebug]: https://xdebug.org
[docker-networking]: https://docs.docker.com/engine/userguide/networking/
[docker-for-mac-network-known-issues]: https://docs.docker.com/docker-for-mac/networking/#/known-limitations-use-cases-and-workarounds
[xdebug-connect-back]: https://xdebug.org/docs/all_settings#remote_connect_back
[docker-for-mac-network-notes]: https://docs.docker.com/docker-for-mac/networking/#/use-cases-and-workarounds
