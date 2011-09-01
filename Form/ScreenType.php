<?php

namespace Dak\InfoScreenBundle\Form;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilder;

class ScreenType extends AbstractType
{
    public function buildForm(FormBuilder $builder, array $options)
    {
        $builder
            ->add('name')
            ->add('description')
            ->add('screenType', 'choice', array(
              'choices' => array(
                '' => '4:3 format (800x600), horisontalt',
                's800x600 vertical' => '4:3 format (800x600), vertikalt',
                's1600x900' => '16:9 format (1600x900), horisontalt',
                's1600x900 vertical' => '16:9 format (1600x900), vertikalt',

              ),
              'required' => false,
            ))
            ->add('slideSource')
            ->add('scalingAllowed', 'checkbox', array('required' => false))
        ;
    }

    public function getName()
    {
        return 'dak_slidebundle_screentype';
    }
}
