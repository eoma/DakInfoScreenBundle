<?php

namespace Dak\InfoScreenBundle\DataFixtures\ORM;

use Doctrine\Common\DataFixtures\AbstractFixture;
use Doctrine\Common\DataFixtures\OrderedFixtureInterface;
use Doctrine\Common\Persistence\ObjectManager;
use Dak\InfoScreenBundle\Entity\Settings;

class LoadBaseData extends AbstractFixture implements OrderedFixtureInterface
{
	public function load (ObjectManager $manager)
    {
        $setting = new Settings();
        $setting->setName('forceScreenReload');
        $setting->setValue("0");

        $manager->persist($setting);
        $manager->flush();
    }

    public function getOrder() {
        return 1;
    }
}
