=== PII Manager===
Contributors: Madhu Sudan, Divesh Kumar
Tags: users, encryption, encrypt user pii data, user data, secure user data, hide user personal information, Personally identifiable information
Requires at least: 3.0
Tested up to: 3.9

PII plugin provides options to encrypt User's PII data.

== Description ==
This plugin helps to encrypt data using PHP's "openssl_encrypt" method. AES-256-CBC is used as cipher method and SHA256 for genrating Vector.
For core fields we have taken care of only email_address and there is a provision of adding custom meta fields as well.




PS: Before putting user meta data fields, you must know the exact meta_key name used in "Wordpress usermeta" table. 

== Installation ==

1) Upload the PII plugin to to the `/wp-content/plugins/` directory
2) Activate the plugin through the 'Plugins' menu in WordPress
3) Go to PII settings.
4) Choose user data which you want to encrypt.

1, 2, 3, 4: You're done!

== Frequently Asked Questions
= How does this module enables encryption?
After installation of this plugin you have to select the fields you would like to be encrypted. Once settings are made this plugin will start encryption once a user is added/modified. 
= How does this pluing encrypts the existing users?
You have to go to the plugin settings page and click on save settings, this will encrypt/decrypt the fields on the basis of settings made.
= What if I want to use any other encryption algorithm?
We are here for paid services :-)

== Screenshots ==
1. Settings for plugin.
2. Settings page.
3. Select the fields you want enable encryption upon.
4. Provide the meta_fields separated by a comma to create under list of fields for encryption.