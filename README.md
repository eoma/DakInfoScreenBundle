
DAK InfoScreen
==============

What?
-----
DAK InfoScreen is a bundle for the [Symfony 2][symfony2] framework that enables you to run several information screens and have them synchronise to a single source.

It is operating in the context of screens and slide sources. A screen displays a slideshow. Several screens may display the same slideshow. If you update a screen or slideshow, the current setup of a screen which use a resource that has been updated, will be reloaded.

A slideshow is defined as a collection HTML5 `section` elements that are children of a collection element with id `slides`. The `body` element is used as a collection element in this

Inspirations
------------

This project draws most of its foundations from [Paul Roget's DZSlide][dzslides].

It is a open source project.

[symfony2]: http://symfony.com/ "Symfony"
[dzslides]: http://paulrouget.com/dzslides/ "DZSlides"
