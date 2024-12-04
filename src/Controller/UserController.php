<?php

namespace App\Controller;
use App\Entity\User;
use App\Form\UserLoginType;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface; 
use App\Entity\Classe; 
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Security\Http\Attribute\IsGranted;
use Symfony\Component\Security\Http\Authentication\AuthenticationUtils;
class UserController extends AbstractController
{
    #[Route('/api/register', name: 'api_register', methods: ['POST'])]
    public function register(
        Request $request,
        EntityManagerInterface $entityManager,
        UserPasswordHasherInterface $passwordHasher
    ): JsonResponse {
        $data = json_decode($request->getContent(), true);
        
        if (!isset($data['email'], $data['prenom'], $data['nom'], $data['plainPassword'])) {
            return new JsonResponse(['error' => 'Missing fields.'], JsonResponse::HTTP_BAD_REQUEST);
        }
        $user = new User();
        $user->setEmail($data['email']);
        $user->setNom($data['nom']);
        $user->setPrenom($data['prenom']);
        $user->setRoles(['ROLE_USER']); 

   
        $hashedPassword = $passwordHasher->hashPassword($user, $data['plainPassword']);
        $user->setPassword($hashedPassword);

      
        $entityManager->persist($user);
        $entityManager->flush();

        return new JsonResponse(['message' => 'User registered successfully'], JsonResponse::HTTP_CREATED);
    }
    
    #[Route('/api/login', name: 'api_login', methods: ['POST'])]
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
   



    
    #[Route('/api/google-login', name: 'api_google_login', methods: ['POST'])]
    public function googleLogin(Request $request, EntityManagerInterface $entityManager): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
    
        if (!isset($data['idToken'])) {
            return new JsonResponse(['error' => 'Missing idToken.'], JsonResponse::HTTP_BAD_REQUEST);
        }
    
        // rremplacez par votre logique pour valider l'idToken avec l'api Google
        $client = new \Google_Client(['client_id' => '409367083188-dp5dm2r4onghld6tfi2m6sgd9cbctgio.apps.googleusercontent.com']);
        $payload = $client->verifyIdToken($data['idToken']);
        if (!$payload) {
            return new JsonResponse(['error' => 'Invalid idToken.'], JsonResponse::HTTP_UNAUTHORIZED);
        }
    
        $email = $payload['email'];
        $nom = $payload['family_name'] ?? '';
        $prenom = $payload['given_name'] ?? '';
    
        // veerifiez si l utilisateur existe deja dans la base de donnees
        $user = $entityManager->getRepository(User::class)->findOneBy(['email' => $email]);
        if (!$user) {
           
            $user = new User();
            $user->setEmail($email);
            $user->setNom($nom);
            $user->setPrenom($prenom);
            $user->setRoles(['ROLE_USER']);
            $user->setPassword('');
    
            $entityManager->persist($user);
            $entityManager->flush();
        }
    
     
        return new JsonResponse([
            'message' => 'Google login successful',
            'role' => $user->getRoles()[0],
        ], JsonResponse::HTTP_OK);
    }
    
}
