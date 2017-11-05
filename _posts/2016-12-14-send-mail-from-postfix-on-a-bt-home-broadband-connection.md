---
layout: post
title: Send mail from Postfix on a BT Home broadband connection
excerpt: How to send mail from Postfix on a BT Home broadband connection via their smarthost
---

In order to send email out from a BT Home Broadband connection, you must use the smarthost that BT provide. Failure to
use this usually means that mail is rejected on the receiving mail server(s) as BT's dynamic IP address ranges are
blacklisted.

Postfix is my MTA of choice and I recently needed to setup a new box to send email out from my broadband connection.
Unfortunately, it took longer than necessary to piece together all the bits of info I needed to successfully send email
out, so I thought I would document it here.

First, you need to ensure that you have setup a BT Email account.
<a href="https://www.bt.com/appsconsumeraccount/secure/manageEmailAccounts.do" data-proofer-ignore>Click here</a> and
create yourself an email address, if you've not already got one in your BT account. You need to make sure that you
record a copy of the email and password that you create as this will be used by Postfix to authenticate with the BT
smarthost.

The following steps have been tested on CentOS 7 and Ubuntu 14.04 LTS so they should be pretty portable. I will assume
that you have Postfix installed on your system. If you need to install Postfix, Google it :blush:

**NOTE**: Run all of the following commands as `root` (`sudo -i`)

* Let's export some variables that will be used in the config. Replace the values below with the email address and
password you just created above:
{% highlight bash %}
export BT_EMAIL_ADDRESS=my_bt_email_username@btinternet.com
export BT_EMAIL_PASSWORD=my_bt_email_password
{% endhighlight %}

* Next we configure Postfix to use the BT smarthost and how it should authenticate with it:
{% highlight bash %}
postconf -e relayhost="[mail.btinternet.com]:587"
postconf -e smtp_sasl_auth_enable=yes
postconf -e smtp_sasl_password_maps="hash:/etc/postfix/sasl_passwd"
postconf -e smtp_sasl_security_options=noanonymous
{% endhighlight %}

* Next up, we create or append to a password file which we will contain the credentials needed to authenticate
with the smart host:
{% highlight bash %}
cat >> /etc/postfix/sasl_passwd <<EOF
[mail.btinternet.com]:587 ${BT_EMAIL_ADDRESS}:${BT_EMAIL_PASSWORD}
EOF
chown root:root /etc/postfix/sasl_passwd  # For security, root should own this file
chmod 0600 /etc/postfix/sasl_passwd       # Only allow owner read+write
postmap /etc/postfix/sasl_passwd          # Generate the hash DB that Postfix expects
{% endhighlight %}

* *Optional: **Running CentOS?** You will need to install an additional package:*
{% highlight bash %}
yum install cyrus-sasl-plain -y
{% endhighlight %}

* Apply the changes to Postfix:
{% highlight bash %}
service postfix start; postfix reload
{% endhighlight %}

* Test! (Replace with your email at the end)
{% highlight bash %}
echo "Hi! This is a test from Postfix via BT." | sendmail some_external_email@example.com
{% endhighlight %}

If you don't receive the test email, check `mailq` and the mail log file:
{% highlight bash %}
tail -f /var/log/mail.log # Ubuntu/Debian
tail -f /var/log/maillog  # CentOS
{% endhighlight %}

Pipe up in the comments below if you have any issues or questions!
