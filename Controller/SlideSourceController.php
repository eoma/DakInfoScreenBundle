<?php

namespace Dak\InfoScreenBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;
use Dak\InfoScreenBundle\Entity\SlideSource;
use Dak\InfoScreenBundle\Form\SlideSourceType;

/**
 * SlideSource controller.
 *
 * @Route("/slidesource")
 */
class SlideSourceController extends Controller
{
    /**
     * Lists all SlideSource entities.
     *
     * @Route("/", name="slidesource")
     * @Template()
     */
    public function indexAction()
    {
        $em = $this->getDoctrine()->getEntityManager();

        $entities = $em->getRepository('DakInfoScreenBundle:SlideSource')->findAll();

        return array('entities' => $entities);
    }

    /**
     * Finds and displays a SlideSource entity.
     *
     * @Route("/{id}/show", name="slidesource_show")
     * @Template()
     */
    public function showAction($id)
    {
        $em = $this->getDoctrine()->getEntityManager();

        $entity = $em->getRepository('DakInfoScreenBundle:SlideSource')->find($id);

        if (!$entity) {
            throw $this->createNotFoundException('Unable to find SlideSource entity.');
        }

        $deleteForm = $this->createDeleteForm($id);

        return array(
            'entity'      => $entity,
            'delete_form' => $deleteForm->createView(),        );
    }

    /**
     * Finds and runs a slideshow.
     *
     * @Route("/{id}/run", name="slidesource_run")
     * @Template()
     */
    public function runAction($id)
    {
        $em = $this->getDoctrine()->getEntityManager();

        $entity = $em->getRepository('DakInfoScreenBundle:SlideSource')->find($id);

        if (!$entity) {
            throw $this->createNotFoundException('Unable to find Screen entity.');
        }

		$slideData = json_decode($entity->getContent());

        return array(
            'slideModules' => $this->get('dak_info_screen.module_manager')->getModules(),
            /*'screen'      => $entity,*/
            'slideSource' => $entity,
			'slideData' => $slideData,
            /*'checkReloadUrl' => $this->get('router')->generate('screen_reload', array('id' => $id, 'currentInstanceTimestamp' => time()), true),*/
            /*'screenType' => $entity->getScreenType(),*/
            /*'scalingAllowed' => $entity->isScalingAllowed() ? 'true' : 'false',*/
        );
    }

    /**
     * Displays a form to create a new SlideSource entity.
     *
     * @Route("/new", name="slidesource_new")
     * @Template()
     */
    public function newAction()
    {
        $entity = new SlideSource();
        $form   = $this->createForm(new SlideSourceType(), $entity);

        return array(
            'slideModules' => $this->get('dak_info_screen.module_manager')->getModules(),
            'entity' => $entity,
            'form'   => $form->createView()
        );
    }

    /**
     * Creates a new SlideSource entity.
     *
     * @Route("/create", name="slidesource_create")
     * @Method("post")
     * @Template("DakInfoScreenBundle:SlideSource:new.html.twig")
     */
    public function createAction()
    {
        $entity  = new SlideSource();
        $request = $this->getRequest();
        $form    = $this->createForm(new SlideSourceType(), $entity);
        $form->bindRequest($request);

        if ($form->isValid()) {
            $em = $this->getDoctrine()->getEntityManager();
            $em->persist($entity);
            $em->flush();

            return $this->redirect($this->generateUrl('slidesource_show', array('id' => $entity->getId())));
            
        }

        return array(
            'entity' => $entity,
            'form'   => $form->createView()
        );
    }

    /**
     * Displays a form to edit an existing SlideSource entity.
     *
     * @Route("/{id}/edit", name="slidesource_edit")
     * @Template()
     */
    public function editAction($id)
    {
        $em = $this->getDoctrine()->getEntityManager();

        $entity = $em->getRepository('DakInfoScreenBundle:SlideSource')->find($id);

        if (!$entity) {
            throw $this->createNotFoundException('Unable to find SlideSource entity.');
        }

        $editForm = $this->createForm(new SlideSourceType(), $entity);
        $deleteForm = $this->createDeleteForm($id);

        return array(
            'slideModules' => $this->get('dak_info_screen.module_manager')->getModules(),
            'entity'      => $entity,
            'edit_form'   => $editForm->createView(),
            'delete_form' => $deleteForm->createView(),
        );
    }

    /**
     * Edits an existing SlideSource entity.
     *
     * @Route("/{id}/update", name="slidesource_update")
     * @Method("post")
     * @Template("DakInfoScreenBundle:SlideSource:edit.html.twig")
     */
    public function updateAction($id)
    {
        $em = $this->getDoctrine()->getEntityManager();

        $entity = $em->getRepository('DakInfoScreenBundle:SlideSource')->find($id);

        if (!$entity) {
            throw $this->createNotFoundException('Unable to find SlideSource entity.');
        }

        $editForm   = $this->createForm(new SlideSourceType(), $entity);
        $deleteForm = $this->createDeleteForm($id);

        $request = $this->getRequest();

        $editForm->bindRequest($request);

        if ($editForm->isValid()) {
            $em->persist($entity);
            $em->flush();

            return $this->redirect($this->generateUrl('slidesource_edit', array('id' => $id)));
        }

        return array(
            'entity'      => $entity,
            'edit_form'   => $editForm->createView(),
            'delete_form' => $deleteForm->createView(),
        );
    }

    /**
     * Deletes a SlideSource entity.
     *
     * @Route("/{id}/delete", name="slidesource_delete")
     * @Method("post")
     */
    public function deleteAction($id)
    {
        $form = $this->createDeleteForm($id);
        $request = $this->getRequest();

        $form->bindRequest($request);

        if ($form->isValid()) {
            $em = $this->getDoctrine()->getEntityManager();
            $entity = $em->getRepository('DakInfoScreenBundle:SlideSource')->find($id);

            if (!$entity) {
                throw $this->createNotFoundException('Unable to find SlideSource entity.');
            }

            $em->remove($entity);
            $em->flush();
        }

        return $this->redirect($this->generateUrl('slidesource'));
    }

    private function createDeleteForm($id)
    {
        return $this->createFormBuilder(array('id' => $id))
            ->add('id', 'hidden')
            ->getForm()
        ;
    }
}
