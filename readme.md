# LCC SharePoint
This project contains assets for deployment into an LCC SharePoint site. The yeoman generator you scaffolded this project from includes generic masterpages, page layouts and sites assets (sass/javascript/images) to enable to to provision these into a site and have the default LCC branding to get you under way.

## Getting Started
These instructions will help you to understand the project and setup up the components for deployment into a SharePoint on-premises environment.

First off, make sure you have gulp installed

```sh
$ npm install -g gulp
```

## Configuration

Copy **settings.default.json** to **settings.json** and update the details:

- **username** - your network username
- **password** - your password
- **siteUrl** - the SharePoint site you want to deploy to


## Customising Assets
### Adding new images
You can extra images by placing them in the app/assets/images directory under the project root.

### Adding custom JavaScript
You can extra javascript code by placing it the application.js in the app/assets/javascripts directory under the project root.
You can also add any other js files into this directory and these will be bundled in.

### Adding customer CSS
CSS files can be placed in the app/assets/css directory or you can edit the application.scss file that was created for you.
Please note other SASS files can be placed in this directory and these will be compiled and bundled.

### Adding other files (Masterpages/Page Layouts/etc..)
Any other files placed in the app/assets directory will be uploaded to _catalogs/masterpage/public in the site configured in the settings.json file.

### Adding file metadata
Some file types require associated metadata, Page Layouts for example. 
Metadata for these files needs to be added to the metadata.json file. The file already contains metadata for the default page layouts, you may copy one of these to use for your custom page layout changing the following attributes:

- **name**: This is the name of the file on the file system
- **Title**: The display title of the layout in SharePoint

You can leave any other attributes.

## Dev Deployment
Modify the settings.json file and enter your network username (without the AD prefix), password and the site you want to deploy the assets to. 
The project contains a [VS Code](https://code.visualstudio.com) build task that will build and upload the files to the SharePoint site.
Press Ctrl + Shift + B to build and upload or from a terminal window type 
```sh
$ gulp upload
```

You can optionally supply the following debug parameter to gulp. Passing this parameter will stop the call to uglify for easier browser debugging.
```sh
--debug
```

To only upload CSS files run the gulp task like this
```sh
$ gulp upload --css
```

If the task thinks you are deploying to a non dev environment, you will be prompted to confirm the deployment.

## Live Deployment
The script allows all settings to be passed as arguments for use as part of CI or CD builds. Call the task like so:
```sh
$ gulp upload --username "<username>" --password "<password>" --siteurl "<http://mysite-url>" --noninteractive
```
the --noninteractive switch will suppress prompts for credentials or live deployment confirmation

### Post deployment
There are currently a few steps you need to carry out once you have deployed the assets. These could be automated as part of the release process if required.
- **Set the Associated Content Type for Page Layouts**
Currently it seems there is no way to set the Associated Content Type property for Page Layouts, you can set the content type but must manually go and set the     Associated Content Type. You only need to do this once, subsequent uploads will be fine.
- **Configure the site to use the new masterpage**
In SharePoint you need to set the Site Collection use the new masterpage. The masterpage will default to the package name that you specified at the start
*TIP: You can find this by looking at the name property in package.json*

## Pushing files to a Git repository
Once you have created a Git repository, you can use the following commands to add the generated project to the repository. Replace **<lcc_repo>** below to match your new repo name

```sh
git init
git add .
git commit -m "first commit"
git remote add origin https://github.com/lccgov/<lcc_repo>.git
git push -u origin master
```
## Gotchas

### Leave the dist folder alone
Seriously, if you want to edit any files edit them in the app folder. If you want to modify any out of the box masterpages, you should do this in the relevant repo then update the package in this project.
Still not convinced? All the files in the dist folder are cleared out at each build if that helps make your mind up.

### Receiving 403 or 401 Unauthorised
You may receive  a 401 or 403 Unauthorised when you try and deploy to the SharePoint site. The easiest way to fix this is to give yourself (or the user you're trying to run as) Full Control in the User Policy for the Web Application
