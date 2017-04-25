var gulp = require('gulp');
var syncy = require('syncy');
var sass = require('gulp-sass');
var notify = require('gulp-notify');
var spsync = require('gulp-spsync-creds').sync;
var settings;
var rmdir = require('rmdir');
var rename = require("gulp-rename");
var packageName = require('root-require')('package.json').name;
var util = require('util');
var htmlreplace = require('gulp-html-replace');
var uglify = require('gulp-uglify');
var cleanCSS = require('gulp-clean-css');
var gutil = require('gulp-util');
var sourcemaps = require('gulp-sourcemaps');
var fileExists = require('file-exists');
var fs = require('fs');
var foreach = require('gulp-foreach');
var path = require('path');
var manifest = require('./manifest.json')
var Mincer = require("mincer")
var mince = require("gulp-mincer")
var _ = require("lodash")
var ignore = require("gulp-ignore")
var metadata = require('./metadata.json');
var prompt = require('gulp-prompt');
var Uuid = require('uuid');

var env = new Mincer.Environment();
env.appendPath('app/assets/javascripts');
env.appendPath('lcc_modules/lcc_frontend_toolkit/javascripts');
env.appendPath('node_modules/lcc_sharepoint_toolkit/javascript');

var settings = {
    username: undefined,
    password: undefined,
    siteUrl: undefined
}

var noninteractive = gutil.env.noninteractive ? true : false;
var promptCreds = false;

gulp.task('clean:dist', (done) => {
    rmdir('./dist', function (err, dirs, files) {
        done();
    });
});

//Sync assets to public folder excluding SASS files and JS
gulp.task('sync:assets', ['clean:dist'], (done) => {
    syncy(['app/assets/**/*', '!app/assets/sass/**',  '!app/assets/javascripts/**', '!app/assets/*_subsite/javascripts/**', '!app/assets/*_subsite/sass/**', '!app/assets/webparts/**'], './dist/_catalogs/masterpage/public', {
            ignoreInDest: '**/stylesheets/**',
            base: 'app/assets',
            updateAndDelete: false
        }).then(() => { 
            done();
    }).catch((err) => { done(err);})
});

//Sync lcc_frontend_toolkit to lcc_modules to be used for SASS partial compilation
gulp.task('sync:lcc_frontend_toolkit', ['sync:assets'], (done) => {
    syncy(['node_modules/lcc_frontend_toolkit/**'], 'lcc_modules/lcc_frontend_toolkit', {
            base: 'node_modules/lcc_frontend_toolkit',
            updateAndDelete: true
        }).then(() => { 
            done();
    }).catch((err) => { done(err);})
});

//Sync app/assets/javascripts/application.js to dist/_catalogs/masterpages/public/javascripts
//Use mince to add required js files
gulp.task('sync:javascripts', ['sync:lcc_frontend_toolkit'], (done) => {
    return gulp.src('app/assets/javascripts/application.js')
        .pipe(mince(env))
        //don't uglify if gulp is ran with '--debug'
        .pipe(gutil.env.debug ? gutil.noop() : uglify({preserveComments: 'all'}))
        .pipe(gulp.dest('dist/_catalogs/masterpage/public/javascripts'));
});

//Sync node_modules/lcc_sharepoint_toolkit/webparts to dist/_catalogs/wp (ignore any that aren't in manifest)
gulp.task('sync:lcc_sharepoint_toolkit_webparts', ['sync:javascripts'], (done) => {
    return gulp.src('node_modules/lcc_sharepoint_toolkit/webparts/*.webpart')
        .pipe(foreach(function(stream, file) {
            return stream.pipe(ignore.exclude(!(_.includes(manifest.webparts, path.basename(file.path,'.webpart')))))
                .pipe(gulp.dest('dist/_catalogs/wp'))
        }))
});

//Sync node_modules/lcc_sharepoint_toolkit/displaytemplates to dist/_catalogs/masterpage/Display Templates/Content Web Parts
gulp.task('sync:lcc_sharepoint_toolkit_displaytemplates', ['sync:lcc_sharepoint_toolkit_webparts'], (done) => {
    return gulp.src('node_modules/lcc_sharepoint_toolkit/displaytemplates/*.html')
        .pipe(gulp.dest('dist/_catalogs/masterpage/Display Templates/Content Web Parts'))
});

//Sync node_modules/lcc_sharepoint_toolkit/xslstylesheets to dist/Style Library/XSL Style Sheets
gulp.task('sync:lcc_sharepoint_toolkit_xslstylesheets', ['sync:lcc_sharepoint_toolkit_displaytemplates'], (done) => {
    return gulp.src('node_modules/lcc_sharepoint_toolkit/xslstylesheets/*.xsl')
        .pipe(gulp.dest('dist/Style Library/XSL Style Sheets'))
});

//Sync lcc_templates_sharepoint/assets excluding JS to dist/_catalogs/masterpages/public
gulp.task('sync:lcc_templates_sharepoint_assets', ['sync:lcc_sharepoint_toolkit_xslstylesheets'], (done) => {
    syncy(['node_modules/lcc_templates_sharepoint/assets/**/*', '!node_modules/lcc_templates_sharepoint/assets/**/*.json', '!node_modules/lcc_templates_sharepoint/assets/javascripts/*', '!node_modules/lcc_templates_sharepoint/assets/stylesheets/*'], 'dist/_catalogs/masterpage/public', {
            base: 'node_modules/lcc_templates_sharepoint/assets',
            updateAndDelete: false
        }).then(() => { 
            done();
    }).catch((err) => { done(err);})
});

//Sync lcc_templates_sharepoint/assets/stylesheets to dist/_catalogs/masterpages/public/stylesheets
gulp.task('sync:lcc_templates_sharepoint_stylesheets', ['sync:lcc_templates_sharepoint_assets'], (done) => {
    return gulp.src('node_modules/lcc_templates_sharepoint/assets/stylesheets/*.css')
        //don't clean if gulp is ran with '--debug'
        .pipe(gutil.env.debug ? gutil.noop() : cleanCSS({processImport:false}))
        .pipe(gulp.dest('dist/_catalogs/masterpage/public/stylesheets'));
});

//Sync lcc_templates_sharepoint/assets/javascripts to dist/_catalogs/masterpages/public/javascripts
gulp.task('sync:lcc_templates_sharepoint_javascript', ['sync:lcc_templates_sharepoint_stylesheets'], (done) => {
    return gulp.src('node_modules/lcc_templates_sharepoint/assets/javascripts/**')
        //don't uglify if gulp is ran with '--debug'
              .pipe(gutil.env.debug ? gutil.noop() : uglify({preserveComments: 'all'}))
        .pipe(gulp.dest('dist/_catalogs/masterpage/public/javascripts'));
});

//Sync lcc_templates_sharepoint/views to dist/_catalogs/masterpages
gulp.task('sync:lcc_templates_sharepoint_views', ['sync:lcc_templates_sharepoint_javascript'], (done) => {
    syncy(['node_modules/lcc_templates_sharepoint/views/*', '!node_modules/lcc_templates_sharepoint/views/lcc-template.master'], 'dist/_catalogs/masterpage', {
            base: 'node_modules/lcc_templates_sharepoint/views',
            updateAndDelete: false
        }).then(() => { 
            done();
    }).catch((err) => { done(err);})
});

var replacements = {};

replacements.css =  util.format('/_catalogs/masterpage/public/stylesheets/%s.css?rev=%s', packageName.replace(/_/g, '-'), Uuid());

//Update app css ref and rename master
gulp.task('sync:lcc_templates_sharepoint_master', ['sync:lcc_templates_sharepoint_views'], (done) => {
    gulp.src("node_modules/lcc_templates_sharepoint/views/lcc-template.master")
    .pipe(htmlreplace(replacements, {keepUnassigned:true}))
    .pipe(rename(util.format("%s.master", packageName))).pipe(gulp.dest("./dist/_catalogs/masterpage")).on('end', function() { done(); });
})

//Compile SASS into the application CSS and copy to public folder
gulp.task('sass', ['sync:lcc_templates_sharepoint_master'], (done) => {
    return gulp.src('app/assets/sass/application.scss')
      .pipe(gutil.env.debug ? sourcemaps.init() : gutil.noop())
      .pipe(sass({includePaths: ['./app/assets/sass',
            'lcc_modules/lcc_frontend_toolkit/stylesheets/']}).on('error', function (err) {
          notify({ title: 'SASS Task' }).write(err.line + ': ' + err.message);
      }))
      .pipe(gutil.env.debug ? sourcemaps.write() : gutil.noop())
      //don't clean if gulp is ran with '--debug'
      .pipe(gutil.env.debug ? gutil.noop() : cleanCSS({ processImport: false }))
      .pipe(rename(util.format("%s.css", packageName.replace(/_/g, '-'))))
      .pipe(gulp.dest('./dist/_catalogs/masterpage/public/stylesheets'))
});

//Compile subsite sass/js and masterpages
gulp.task('sass:subsites', ['sass'], (done) => {
    return gulp.src(['app/assets/*_subsite/sass/*.scss'])
    .pipe(foreach(function(stream, file) {          
        var subsite = (path.normalize(util.format('%s%s..', path.dirname(file.path), path.sep)).split(path.sep).pop());
        return stream.pipe(sass({includePaths: ['./app/assets/sass' + subsite,
            'lcc_modules/lcc_frontend_toolkit/stylesheets/']}).on('error', function (err) {
            notify({ title: 'SASS Task' }).write(err.line + ': ' + err.message);
            this.emit('end');
        }))
        .pipe(gutil.env.debug ? sourcemaps.write() : gutil.noop())
        //don't clean if gulp is ran with '--debug'
        .pipe(gutil.env.debug ? gutil.noop() : cleanCSS({ processImport: false }))
        .pipe(rename(function(path) {
            path.dirname = "";
            return path;
        }))
        .pipe(gulp.dest(util.format('./dist/_catalogs/masterpage/public/%s/stylesheets', subsite)));     
    }));
});

//Add subsite masterpages
gulp.task('sync:subsites_master', ['sass:subsites'], (done) => {
    return gulp.src('app/assets/*_subsite/', ['!app/assets/*_subsite/**/*.*'])
        .pipe(foreach(function(stream, folder) {  
            var subsiteName = folder.path.split(path.sep).pop();
            var replacements = {};
            replacements.css =  util.format('/_catalogs/masterpage/public/%s/stylesheets/application.css', subsiteName);

            if(_.includes(manifest.footerSubsites, subsiteName))
            {
                replacements.footerCustom = util.format('<CQWPFooter:ContentByQueryWebPart runat="server" ItemStyle="NoImage" GroupStyle="DefaultHeader" WebUrl="~sitecollection/" ItemXslLink="/Style Library/XSL Style Sheets/RC_ReusableContent.xsl" ListName="Reusable Content" FilterField1="Title" Filter2ChainingOperator="Or" FilterDisplayValue1="%s" FilterValue1="%s" FilterType1="Text" DataMappingViewFields="{fa564e0f-0c70-4ab9-b863-0177e6ddd247},Text;{82dd22bf-433e-4260-b26e-5b8360dd9105},HTML;" GroupByDirection="Desc" SortByDirection="Desc" ItemLimit="1" DataMappings="Description:{82dd22bf-433e-4260-b26e-5b8360dd9105},ReusableHtml,HTML;|ImageUrl:|Title:{fa564e0f-0c70-4ab9-b863-0177e6ddd247},Title,Text;|LinkUrl:|" ServerTemplate="100" UseCopyUtil="True" ShowUntargetedItems="False" EnableOriginalValue="False" ViewFlag="0" ViewContentTypeId="" ListId="00000000-0000-0000-0000-000000000000" PageSize="-1" UseSQLDataSourcePaging="True" DataSourceID="" ShowWithSampleData="False" AsyncRefresh="False" ManualRefresh="False" AutoRefresh="False" AutoRefreshInterval="60" InitialAsyncDataFetch="False" Title="&lt;%$Resources:cmscore,ContentQueryWebPart_Title%&gt;" FrameType="None" SuppressWebPartChrome="False" Description="&lt;%$Resources:cmscore,ContentQueryWebPart_Description%&gt;" IsIncluded="True" ZoneID="ImportedPartZone" PartOrder="0" FrameState="Normal" AllowRemove="True" AllowZoneChange="True" AllowMinimize="True" AllowConnect="True" AllowEdit="True" AllowHide="True" IsVisible="True" DetailLink="" HelpLink="" HelpMode="Modeless" Dir="Default" PartImageSmall="" MissingAssembly="&lt;%$Resources:cmscore,WebPartImportError%&gt;" ImportErrorMessage="&lt;%$Resources:cmscore,WebPartImportError%&gt;" PartImageLarge="" IsIncludedFilter="" ExportControlledProperties="True" ConnectionID="00000000-0000-0000-0000-000000000000" ID="g_64820d85_08aa_41d4_b223_3991f4fa728f" ChromeType="None" ExportMode="All" __MarkupType="vsattributemarkup" __WebPartId="{64820d85-08aa-41d4-b223-3991f4fa728f}" WebPart="true" Height="" Width=""> \
                    <Xsl> \
                        <xsl:stylesheet version="1.0" exclude-result-prefixes="xsl cmswrt x"> \
                            <xsl:import href="/Style Library/Footer XSL Style Sheets/Header.xsl" /> \
                            <xsl:import href="/Style Library/XSL Style Sheets/RC_ReusableContent.xsl" /> \
                            <xsl:import href="/Style Library/Footer XSL Style Sheets/ContentQueryMain.xsl" /> \
                        </xsl:stylesheet> \
                    </Xsl> \
                    <SampleData></SampleData> \
                    <DataFields /> \
                    </CQWPFooter:ContentByQueryWebPart>', subsiteName, subsiteName);
            }

            return gulp.src("node_modules/lcc_templates_sharepoint/views/lcc-template.master")
 	            .pipe(htmlreplace(replacements, {keepUnassigned:true}))
                .pipe(rename(util.format("lcc_%s.master", subsiteName))).pipe(gulp.dest("./dist/_catalogs/masterpage"));
        }));
});

// load settings from file/args
gulp.task('pre-flight', ['sync:subsites_master'],
    (done) => {
        gutil.log(gutil.colors.green('Looking for settings'));
        if(fileExists('./settings.json')) {
            settings =  require('./settings.json');
        }

        settings.username = gutil.env.username ? gutil.env.username : settings.username; 
        settings.password = gutil.env.password ? gutil.env.password : settings.password; 
        settings.siteUrl = gutil.env.siteurl ? gutil.env.siteurl : settings.siteUrl; 

        if(settings.username)
        {
            gutil.log(gutil.colors.green('found settings for ', settings.username));
        }
        else {
            gutil.log(gutil.colors.yellow('Found no user settings in config or args'));
            promptCreds = true;
        }
        done();
    }
);

// prompt for credentials if required
gulp.task('prompt',['pre-flight'], function () {
    return gulp.src('')
    .pipe((promptCreds && !noninteractive) ? 
        prompt.prompt(
        [{
            type: 'input',
            message: 'Please enter your username',
            name: 'username',
            default: ''
        },
        {
            type: 'password',
            message: 'Please enter your password',
            name: 'password'
        },{
            type: 'input',
            message: 'Please enter the site Url',
            name: 'siteurl',
            default: ''
        }],
        function(response){
            settings.username = response.username;
            settings.password = response.password;
            settings.siteUrl = response.siteurl;

        }) : gutil.noop()
    );
});

gulp.task('sp-upload', ['prompt'], (done) => {
    var glob = gutil.env.css ? 'dist/**/*.css' :'dist/**/*.*';
    return gulp.src(glob)
    .pipe(((settings.siteUrl.indexOf("dev")) == -1 && (!noninteractive)) ? prompt.confirm({
        message: 'You appear to be deploying to a non dev environment, is that ok?',
        default: false
    }) : gutil.noop())
    .pipe(spsync({
        "username": settings.username,
        "password": settings.password,
        "site": settings.siteUrl,
        "publish": true,
        "verbose": false,
        "update_metadata":true,
        "files_metadata": metadata
    })
    );
});

gulp.task('default',  ['clean:dist', 'sync:assets', 'sync:lcc_frontend_toolkit', 'sync:javascripts', 'sync:lcc_sharepoint_toolkit_webparts', 'sync:lcc_sharepoint_toolkit_displaytemplates', 'sync:lcc_sharepoint_toolkit_xslstylesheets', 'sync:lcc_templates_sharepoint_assets', 'sync:lcc_templates_sharepoint_stylesheets', 'sync:lcc_templates_sharepoint_javascript', 'sync:lcc_templates_sharepoint_views', 'sync:lcc_templates_sharepoint_master', 'sass', 'sass:subsites', 'sync:subsites_master']);
gulp.task('upload',  ['default', 'sp-upload']);