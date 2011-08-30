<?php

namespace Dak\InfoScreenBundle\Entity;

use Gedmo\Mapping\Annotation as Gedmo;
use Doctrine\ORM\Mapping as ORM;

/**
 * Dak\InfoScreenBundle\Entity\Screen
 *
 * @ORM\Table()
 * @ORM\Entity
 */
class Screen
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
     * @Gedmo\Sluggable(slugField="slug")
     * @ORM\Column(name="name", type="string", length=255, unique=TRUE)
     */
    private $name;

    /**
     * @var string $slug
     *
     * @Gedmo\Slug
     * @ORM\Column(name="slug", type="string", length=255, unique=TRUE)
     */
    private $slug;

    /**
     * @var text $description
     *
     * @ORM\Column(name="description", type="text")
     */
    private $description;

    /**
     * @var object $slideSource
     *
     * @ORM\ManyToOne(targetEntity="SlideSource", inversedBy="screens")
     */
	private $slideSource;

    /**
     * @var string $screenType
     *
     * @ORM\Column(name="screentype", type="string", length=50, nullable=TRUE)
     */
    private $screenType;

    /**
     * @var bool $scalingAllowed
     *
     * @ORM\Column(name="scalingAllowed", type="boolean")
     */
    private $scalingAllowed = true;

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

    public function getId()
    {
        return $this->id;
    }

    public function getName()
    {
		return $this->name;
	}

    public function setName($name)
    {
        $this->name = strval($name);
    }

	public function getSlideSource()
    {
		return $this->slideSource;
	}

	public function setSlideSource(SlideSource $slideSource)
    {
		$this->slideSource = $slideSource;
	}

    public function getDescription ()
    {
        return $this->description;
    }

    public function setDescription($description = null)
    {
        $this->description = strval($description);
    }

    public function getScreenType()
    {
        return $this->screenType;
    }

    public function setScreenType($screenType = '')
    {
        $this->screenType = strval($screenType);
    }

   public function isScalingAllowed()
    {
        return (($this->scalingAllowed == '1') || ($this->scalingAllowed == 1)) ? true : false;
    }

    public function setScalingAllowed($scalingAllowed = true)
    {
        $this->scalingAllowed = ($scalingAllowed == true) ? '1' : '0';
    }

    public function getSlug ()
    {
        return $this->slug;
    }

    public function getCreatedAt()
    {
        return $this->created_at;
    }

    public function getUpdatedAt()
    {
        return $this->updated_at;
    }
}
