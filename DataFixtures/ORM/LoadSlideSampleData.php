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
        $slideSource->setContent(<<<EOT
{
    "defaultSlideDuration": 5000,
    "slides": [
        {
            "content": "<section><h1>Kitties!</h1></section>",
            "css": ""
        },
        {
            "content": "<section class=\"pictureCollection\"><img src=\"http://placekitten.com/800/600\" alt=\"\"><img src=\"http://placekitten.com/g/800/600\" alt=\"\"></section>",
            "css": ""
        }
    ]
}
EOT
);

        $manager->persist($slideSource);

        $slideSource2 = new SlideSource();
        $slideSource2->setName('events');
        $slideSource2->setContent(<<<EOT
{
    "defaultSlideDuration": 6000,
    "slides": [
        {
            "content": "<section class=\"eventGreeting\"><h1>Events!</h1></section>",
            "css": ".eventGreeting > h1 { color: red; }"
        },
        {
            "content": "<div class=\"eventSlideTrigger\" data-dayspan=\"6\"></div>",
            "css": ""
        }
    ]
}
EOT
);

        $manager->persist($slideSource2);
        $manager->flush();

        $this->addReference('kitties', $slideSource);
        $this->addReference('events', $slideSource2);
    }

    public function getOrder() {
        return 2;
    }
}
