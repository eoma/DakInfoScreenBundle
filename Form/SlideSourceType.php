<?php

namespace Dak\InfoScreenBundle\Form;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilder;

class SlideSourceType extends AbstractType
{
    public function buildForm(FormBuilder $builder, array $options)
    {
        $builder
            ->add('name')
            ->add('content', 'hidden')
            //->add('content', 'input', array('type' => 'hidden'))
            //->add('extraCss', 'hidden')
        ;
    }

    public function getName()
    {
        return 'dak_info_screen_slidesourcetype';
    }
}
