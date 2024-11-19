<?php 
// src/Controller/SecurityController.php
namespace App\Controller;
use App\Form\UserLoginType;
use Symfony\Component\HttpFoundation\Request;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Authentication\AuthenticationUtils;
#[Route('/api')]
class SecurityController extends AbstractController
{   
    #[Route('/login', name: 'api_login', methods: ['POST'])]
    public function login(Request $request, AuthenticationUtils $authenticationUtils): JsonResponse
    {
        $error = $authenticationUtils->getLastAuthenticationError();
        $lastUsername = $authenticationUtils->getLastUsername();

        $response = [
            'lastUsername' => $lastUsername,
            'error' => $error ? $error->getMessage() : null,
        ];

        return new JsonResponse($response, Response::HTTP_OK);
    }
}
?>