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
            ->add('content')
            ->add('extraCss', 'textarea', array('required' => false))
        ;
    }

    public function getName()
    {
        return 'dak_info_screen_slidesourcetype';
    }
}
