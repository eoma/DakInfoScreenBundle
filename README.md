
DAK InfoScreen
==============

What?
-----
DAK InfoScreen is a bundle for the [Symfony 2][symfony2] framework that enables you to run several information screens and have them synchronise to a single source.

It is operating in the context of screens and slide sources. A screen displays a slideshow. Several screens may display the same slideshow. If you update a screen or slideshow, the current setup of a screen which use a resource that has been updated, will be reloaded.

A slideshow is defined as a collection HTML5 `section` elements that are children of a collection element with id `slides`. The `body` element is used as a collection element in this

Dependencies
------------

* The [symfony framework][symfony2].
* The [StofDoctrineExtensionsBundle][stofDoctrine].
* The [DoctrineFixturesBundle][doctrineFixtures].

Installation
------------

Clone this into your project's vendor/bundles/Dak/InfoScreenBundle or your src/Dak/InfoScreenBundle (recommended) directory

    git submodule add git://github.com/eoma/DakInfoScreenBundle.git vendor/bundles/Dak/InfoScreenBundle

You have to register the Dak namespace in your app/autoload.php (if you downloaded it to vendor/bundles):

    $loader->registerNamespaces(array(
        ...
        'Dak'              => __DIR__.'/../vendor/bundles',
        ...
    ));

You must then register the bundle in your app/AppKernel.php file. Paste the following snippet in the array in the registerBundles method:

    new Dak\InfoScreenBundle\DakInfoScreenBundle(),

The you paste the following in to your app/config/routing.yml:

    DakInfoScreenBundle:
        resource: "@DakInfoScreenBundle/Controller/"
        type:     annotation
        prefix:   /

You can of course customise the route prefix if you are using several userinteracting bundles.

This final snippet should be pasted into your app/config/config.yml file:

    stof_doctrine_extensions:
        orm:
            default:
                timestampable: true
                sluggable: true

You could also paste the contents of [Resources/config/config.yml.example][slideShowModuleConfiguration] if you want to enable the default slide show modules that exists in this module.

You should now be ready to create the database schema required for this bundle.

If you don't have any pre-existing schemas in your database:

    php app/console doctrine:schema:create

If you have some preexisting schemas in your database that you don't want to lose please install [DoctrineMigrationsBundle][doctrineMigrations] and read up on the procedure.

After you have created the schemas, you should the initial fixtures.

    php app/console doctrine:fixtures:load

Install the assets (css, js):

    php app/console assets:install web/ # Add --symlink if you are using symlinks for your assets.

Now it should work.

Slide show modules
------------------

If you want to use the included slide show modules, you should paste the contents of [Resources/config/config.yml.example][slideShowModuleConfiguration] into your app/config/config.yml.

If you want to write one yourself, you can take a peek at the modules included or just copy and rename the dummy module. All slide show modules reside in [Resources/public/mods/](https://github.com/eoma/DakInfoScreenBundle/tree/master/Resources/public/mods)

Inspirations
------------

This project draws most of its foundations from [Paul Roget's DZSlide][dzslides].

It is an open source project.

[symfony2]: http://symfony.com/ "Symfony"
[dzslides]: http://paulrouget.com/dzslides/ "DZSlides"
[stofDoctrine]: https://github.com/stof/StofDoctrineExtensionsBundle "StofDoctrineExtensionsBundle"
[doctrineFixtures]: http://symfony.com/doc/current/bundles/DoctrineFixturesBundle/index.html
[doctrineMigrations]: http://symfony.com/doc/current/bundles/DoctrineMigrationsBundle/index.html
[slideShowModuleconfiguration]: https://github.com/eoma/DakInfoScreenBundle/tree/master/Resources/config/config.example.yml
