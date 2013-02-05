<?php

namespace Dak\InfoScreenBundle\DataFixtures\ORM;

use Doctrine\Common\DataFixtures\AbstractFixture;
use Doctrine\Common\DataFixtures\OrderedFixtureInterface;
use Doctrine\Common\Persistence\ObjectManager;
use Dak\InfoScreenBundle\Entity\Screen;

class LoadScreenSampleData extends AbstractFixture implements OrderedFixtureInterface
{
	public function load (ObjectManager $manager)
    {
        $screen = new Screen();
        $screen->setName('screen 1');
        $screen->setDescription("Just a test screen");
        $screen->setSlideSource($manager->merge($this->getReference('events')));
        $screen->setScalingAllowed(true);

        $manager->persist($screen);
        $manager->flush();
    }

    public function getOrder() {
        return 3;
    }
}
