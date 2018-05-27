# Guide for [traefik](https://traefik.io)

This will not cover setting up https to protect your password from being sent over the internet in clear text see https://docs.traefik.io/configuration/acme/ .

## See sample [traefik.toml](traefik.toml)
Look at example [traefik.toml](traefik.toml) there are 3 lines you will want to change in it.

* change `url = "http://drawpile-rpc:7777"` to reference that path to your drawpile RPC endpoint
* change both isntances of `"test:$apr1$71lnBZLg$R8npQ9XocED.pduy5ytFz0",` to a different password 
    * currently it uses username: test, password: test.
    * The password is using htpasswd. You can use your own tool to do this, or use the site http://aspirine.org/htpasswd_en.html.
        * example fill out (1. Users and passwords) with content 
            * test test
        * go to (2. Generated htpasswd file) and click "Generate htpasswd content"
            * copy generated content into previous line `"test:$apr1$71lnBZLg$R8npQ9XocED.pduy5ytFz0",`



**NOTE** if you use a password on the drawpile srv rpc endpoints themselves, then it is easiest to just use the same password here. Also you will not need to specify the password in the last section. So remove the whole basicAuth = [...]


## Launch traefik

The easiest way to use treafik is through containers. If you are not familiar with containers go to https://docs.docker.com/get-started/#prepare-your-docker-environment . After updating the file, launch your docker container.

`docker run --restart=always --name=drawpile -it -p "9999:80" -v "$(pwd)/traefik.toml:/traefik.toml" traefik`

Will autodownload traefik & launch docker on port 9999. now go to http://localhost:9999 to administrate drawpile
