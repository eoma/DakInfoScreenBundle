<?php

namespace Dak\InfoScreenBundle\DataFixtures\ORM;

use Doctrine\Common\DataFixtures\AbstractFixture;
use Doctrine\Common\DataFixtures\OrderedFixtureInterface;
use Dak\InfoScreenBundle\Entity\SlideSource;

class LoadSlideSampleData extends AbstractFixture implements OrderedFixtureInterface
{
	public function load ($manager)
    {
        $slideSource = new SlideSource();
        $slideSource->setName('kitties');
        $slideSource->setContent("
<section>
  <h1>Kitties!</h1>
</section>

<section class=\"pictureCollection\">
  <img src=\"http://placekitten.com/800/600\" />
  <img src=\"http://placekitten.com/g/800/600\" />
  <img src=\"http://placekitten.com/g/800/599\" />
</section>");

        $manager->persist($slideSource);

        $slideSource2 = new SlideSource();
        $slideSource2->setName('events');
        $slideSource2->setContent("
<section>
  <h1>Events!</h1>
</section>

<div class=\"eventSlideTrigger\" data-dayspan=\"6\"></div>
");

        $manager->persist($slideSource2);
        $manager->flush();

        $this->addReference('kitties', $slideSource);
        $this->addReference('events', $slideSource2);
    }

    public function getOrder() {
        return 2;
    }
}
