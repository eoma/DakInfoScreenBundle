<?php

namespace Dak\InfoScreenBundle\DependencyInjection;

use Symfony\Component\Config\Definition\Builder\TreeBuilder;
use Symfony\Component\Config\Definition\ConfigurationInterface;

/**
 * This is the class that validates and merges configuration from your app/config files
 *
 * To learn more see {@link http://symfony.com/doc/current/cookbook/bundles/extension.html#cookbook-bundles-extension-config-class}
 */
class Configuration implements ConfigurationInterface
{
    /**
     * {@inheritDoc}
     */
    public function getConfigTreeBuilder()
    {
        $treeBuilder = new TreeBuilder();
        $rootNode = $treeBuilder->root('dak_info_screen');

        // Here you should define the parameters that are allowed to
        // configure your bundle. See the documentation linked above for
        // more information on that topic.

        $rootNode
            ->children()
                ->arrayNode('modules')
                    ->useAttributeAsKey('name')
                    ->prototype('array')
                        ->children()
                            ->scalarNode('directory') // Relative to web root
                                ->cannotBeEmpty()
                            ->end()
                            ->arrayNode('style') // A list of required stylesheets for the presenter
                                ->prototype('scalar')->end()
                            ->end()
                            ->arrayNode('script') // A list of required scripts for the presenter
                                ->prototype('scalar')->end()
                            ->end()
                            ->scalarNode('reference')
                                ->cannotBeEmpty()
                                ->defaultFalse()
                            ->end()
                            ->arrayNode('editor')
                                ->cannotBeEmpty()
                                ->children()
                                    ->arrayNode('style')
                                        ->prototype('scalar')->end()
                                    ->end()
                                    ->arrayNode('script')
                                        ->prototype('scalar')->end()
                                    ->end()
                                ->end()
                            ->end()
                        ->end()
                     ->end()
                ->end()
            ->end()
        ;

        return $treeBuilder;
    }
}
