<?php

namespace Dak\InfoScreenBundle\Controller;

use Symfony\Component\HttpFoundation\Response;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;

/**
 * Screen controller.
 *
 * @Route("/")
 */
class DefaultController extends Controller
{
    /**
     * Introductory screen.
     *
     * @Route("/", name="_welcome")
     * @Template()
     */
    public function indexAction()
    {
        return Array();
    }
}
