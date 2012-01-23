<?php

namespace Dak\InfoScreenBundle\Entity;

use Gedmo\Mapping\Annotation as Gedmo;
use Doctrine\ORM\Mapping as ORM;

/**
 * Dak\InfoScreenBundle\Entity\SlideSource
 *
 * @ORM\Table()
 * @ORM\Entity
 * @ORM\HasLifecycleCallbacks
 */
class SlideSource
{
    /**
     * @var integer $id
     *
     * @ORM\Column(name="id", type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    private $id;

    /**
     * @var string $name
     *
     * @ORM\Column(name="name", type="string", length=255, unique=TRUE)
     */
    private $name;

    /**
     * @var text $description
     *
     * @ORM\Column(name="description", type="text")
     */
    private $content;

    /**
     * @var text $extraCss
     *
     * @ORM\Column(name="extraCss", type="text", nullable=TRUE)
     */
    private $extraCss;

    /**
     * @var array $screens
     *
     * @ORM\OneToMany(targetEntity="Screen", mappedBy="slideSource")
     */
    private $screens;

    /**
     * @ORM\Column(name="created_at", type="datetime")
     * @Gedmo\Timestampable
     */
    private $created_at;

    /**
     * @ORM\Column(name="updated_at", type="datetime")
     * @Gedmo\Timestampable
     */
    private $updated_at;


    public function __toString()
    {
        return $this->getName();
    }

    /**
     * Get id
     *
     * @return integer 
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * Set name
     *
     * @param string $name
     */
    public function setName($name)
    {
        $this->name = strval($name);
    }

    /**
     * Get name
     *
     * @return string 
     */
    public function getName()
    {
        return $this->name;
    }

    /**
     * Get content
     *
     * @return text 
     */
    public function getContent()
    {
        return $this->content;
    }

    public function setContent ($content = "")
    {
        $this->content = strval($content);
    }

    /**
     * Get extraCss
     *
     * @return text 
     */
    public function getExtraCss()
    {
        return $this->extraCss;
    }

    public function setExtraCss ($extraCss = "")
    {
        $this->extraCss = strval($extraCss);
    }

    public function getCreatedAt()
    {
        return $this->created_at;
    }

    public function getUpdatedAt()
    {
        return $this->updated_at;
    }

    public function getScreens()
    {
        return $this->screens;
    }
    
    /**
     * @ORM\PreRemove
     */
    public function preRemove() {
		foreach ($this->getScreens() as $s) {
			$s->setSlideSource(null);
		}
	}
}
