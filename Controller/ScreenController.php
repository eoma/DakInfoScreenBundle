<?php

namespace Dak\InfoScreenBundle\Controller;

use Symfony\Component\HttpFoundation\Response;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;
use Dak\InfoScreenBundle\Entity\Screen;
use Dak\InfoScreenBundle\Entity\Settings;
use Dak\InfoScreenBundle\Form\ScreenType;

/**
 * Screen controller.
 *
 * @Route("/screen")
 */
class ScreenController extends Controller
{
    /**
     * Lists all Screen entities.
     *
     * @Route("/", name="screen")
     * @Template()
     */
    public function indexAction()
    {
        $em = $this->getDoctrine()->getManager();

        $entities = $em->getRepository('DakInfoScreenBundle:Screen')->findAll();
		$forceReload = $em->getRepository('DakInfoScreenBundle:Settings')->findOneBy(array('name' => 'forceScreenReload'));

        return array(
            'entities' => $entities,
            'forceReload' => $forceReload->getValue(),
        );
    }

    /**
     * Finds and displays a Screen entity.
     *
     * @Route("/{id}", name="screen_show", requirements={"id" = "\d+"})
     * @Route("/n/{slug}", name="screen_show_slug")
     * @Template()
     */
    public function showAction($id = 0, $slug = null)
    {
        $em = $this->getDoctrine()->getManager();

		$slug = trim($slug);

		if ($id > 0) {
			$entity = $em->getRepository('DakInfoScreenBundle:Screen')->find($id);
		} else if (strlen($slug) > 0) {
			$entity = $em->getRepository('DakInfoScreenBundle:Screen')->findOneBy(array('slug' => $slug));
		} else {
			$entity = false;
		}

        if (!$entity) {
            throw $this->createNotFoundException('Unable to find Screen entity.');
        }

        $deleteForm = $this->createDeleteForm($entity->getId());

        return array(
            'entity'      => $entity,
            'delete_form' => $deleteForm->createView(),        );
    }

    /**
     * Finds and runs a Screen slideshow.
     *
     * @Route("/{id}/run", name="screen_run", requirements={"id" = "\d+"})
     * @Route("/n/{slug}/run", name="screen_run_slug")
     * @Template()
     */
    public function runAction($id = 0, $slug = null)
    {
        $em = $this->getDoctrine()->getManager();

		$slug = trim($slug);

		if ($id > 0) {
			$entity = $em->getRepository('DakInfoScreenBundle:Screen')->find($id);
		} else if (strlen($slug) > 0) {
			$entity = $em->getRepository('DakInfoScreenBundle:Screen')->findOneBy(array('slug' => $slug));
		} else {
			$entity = false;
		}

		$forceReload = $em->getRepository('DakInfoScreenBundle:Settings')->findOneBy(array('name' => 'forceScreenReload'));

        if (!$entity) {
            throw $this->createNotFoundException('Unable to find Screen entity.');
        }

		$slideData = json_decode($entity->getSlideSource()->getContent());

        return array(
            'slideModules' => $this->get('dak_info_screen.module_manager')->getModules(),
            'screen'      => $entity,
            'slideSource' => $entity->getSlideSource(),
            'slideData' => $slideData,
            'checkReloadUrl' => $this->get('router')->generate('screen_reload', array('id' => $entity->getId(), 'currentInstanceTimestamp' => time()), true),
            'screenType' => $entity->getScreenType(),
            /*'extraCss' => $entity->getSlideSource()->getExtraCss(),*/
            'scalingAllowed' => $entity->isScalingAllowed() ? 'true' : 'false',
            'forceReload' => $forceReload->getValue(),
        );
    }

    /**
     * Checks if it is necessary to reload the screen Screen slideshow.
     *
     * @Route("/{id}/reload/{currentInstanceTimestamp}", name="screen_reload", requirements={"id" = "\d+", "currentInstanceTimestamp" = "\d+"} )
     */
    public function reloadAction($id, $currentInstanceTimestamp)
    {

        $em = $this->getDoctrine()->getManager();

        $screen = $em->getRepository('DakInfoScreenBundle:Screen')->find($id);
		$forceReload = $em->getRepository('DakInfoScreenBundle:Settings')->findOneBy(array('name' => 'forceScreenReload'));

		$forceReloadTimestamp = 0;

		if ($forceReload !== false) {
			$forceReloadTimestamp = intval($forceReload->getValue());
		}

		$response = array(
            'reload' => false,
            'reloadNow' => false,
        );

        if (!$screen) {
            throw $this->createNotFoundException('Unable to find Screen entity.');
        }

        $screenUpdatedAt = $screen->getUpdatedAt()->getTimestamp();
        $slideSourceUpdatedAt = $screen->getSlideSource()->getUpdatedAt()->getTimestamp();

        if ($currentInstanceTimestamp < $slideSourceUpdatedAt) {
            $response['reload'] = true;
        }

        if ($currentInstanceTimestamp < $forceReloadTimestamp) {
            $response['reload'] = true;
            $response['reloadNow'] = true;
        }

        return new Response(json_encode($response));
    }

    /**
     * Checks if it is necessary to reload the screen Screen slideshow.
     *
     * @Route("/forcereload", name="screen_force_reload" )
     */
    public function forceReloadAction()
    {

        $em = $this->getDoctrine()->getManager();

		$forceReload = $em->getRepository('DakInfoScreenBundle:Settings')->findOneBy(array('name' => 'forceScreenReload'));

		if ($forceReload !== false) {
            $forceReload->setValue(strval(time()));
            $em->persist($forceReload);
            $em->flush();
		}

        return $this->redirect($this->generateUrl('screen'));
    }

    /**
     * Displays a form to create a new Screen entity.
     *
     * @Route("/new", name="screen_new")
     * @Template()
     */
    public function newAction()
    {
        $entity = new Screen();
        $form   = $this->createForm(new ScreenType(), $entity);

        return array(
            'entity' => $entity,
            'form'   => $form->createView()
        );
    }

    /**
     * Creates a new Screen entity.
     *
     * @Route("/create", name="screen_create")
     * @Method("post")
     * @Template("DakInfoScreenBundle:Screen:new.html.twig")
     */
    public function createAction()
    {
        $entity  = new Screen();
        $request = $this->getRequest();
        $form    = $this->createForm(new ScreenType(), $entity);
        $form->bindRequest($request);

        if ($form->isValid()) {
            $em = $this->getDoctrine()->getManager();
            $em->persist($entity);
            $em->flush();

            return $this->redirect($this->generateUrl('screen_show', array('id' => $entity->getId())));
            
        }

        return array(
            'entity' => $entity,
            'form'   => $form->createView()
        );
    }

    /**
     * Displays a form to edit an existing Screen entity.
     *
     * @Route("/{id}/edit", name="screen_edit")
     * @Template()
     */
    public function editAction($id)
    {
        $em = $this->getDoctrine()->getManager();

        $entity = $em->getRepository('DakInfoScreenBundle:Screen')->find($id);

        if (!$entity) {
            throw $this->createNotFoundException('Unable to find Screen entity.');
        }

        $editForm = $this->createForm(new ScreenType(), $entity);
        $deleteForm = $this->createDeleteForm($id);

        return array(
            'entity'      => $entity,
            'edit_form'   => $editForm->createView(),
            'delete_form' => $deleteForm->createView(),
        );
    }

    /**
     * Edits an existing Screen entity.
     *
     * @Route("/{id}/update", name="screen_update")
     * @Method("post")
     * @Template("DakInfoScreenBundle:Screen:edit.html.twig")
     */
    public function updateAction($id)
    {
        $em = $this->getDoctrine()->getManager();

        $entity = $em->getRepository('DakInfoScreenBundle:Screen')->find($id);

        if (!$entity) {
            throw $this->createNotFoundException('Unable to find Screen entity.');
        }

        $editForm   = $this->createForm(new ScreenType(), $entity);
        $deleteForm = $this->createDeleteForm($id);

        $request = $this->getRequest();

        $editForm->bindRequest($request);

        if ($editForm->isValid()) {
            $em->persist($entity);
            $em->flush();

            return $this->redirect($this->generateUrl('screen_edit', array('id' => $id)));
        }

        return array(
            'entity'      => $entity,
            'edit_form'   => $editForm->createView(),
            'delete_form' => $deleteForm->createView(),
        );
    }

    /**
     * Deletes a Screen entity.
     *
     * @Route("/{id}/delete", name="screen_delete")
     * @Method("post")
     */
    public function deleteAction($id)
    {
        $form = $this->createDeleteForm($id);
        $request = $this->getRequest();

        $form->bindRequest($request);

        if ($form->isValid()) {
            $em = $this->getDoctrine()->getManager();
            $entity = $em->getRepository('DakInfoScreenBundle:Screen')->find($id);

            if (!$entity) {
                throw $this->createNotFoundException('Unable to find Screen entity.');
            }

            $em->remove($entity);
            $em->flush();
        }

        return $this->redirect($this->generateUrl('screen'));
    }

    private function createDeleteForm($id)
    {
        return $this->createFormBuilder(array('id' => $id))
            ->add('id', 'hidden')
            ->getForm()
        ;
    }
}
