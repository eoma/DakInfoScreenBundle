<?php

namespace Dak\InfoScreenBundle\Entity;

use Gedmo\Mapping\Annotation as Gedmo;
use Doctrine\ORM\Mapping as ORM;

/**
 * Dak\InfoScreenBundle\Entity\Settings
 *
 * @ORM\Table()
 * @ORM\Entity
 */
class Settings
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
     * @ORM\Column(name="name", type="string", length=255)
     */
    private $name;

    /**
     * @var text $description
     *
     * @ORM\Column(name="value", type="text", nullable=TRUE)
     */
    private $value;

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

    public function getValue ()
    {
        return $this->value;
    }

    public function setValue($description = null)
    {
        $this->value = strval($description);
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
