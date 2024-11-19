<?php
namespace App\security;

use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\RouterInterface;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Http\Authentication\AuthenticationSuccessHandlerInterface;

class LoginSuccessHandler implements AuthenticationSuccessHandlerInterface
{
    private RouterInterface $router;

    public function __construct(RouterInterface $router)
    {
        $this->router = $router;
    }

    public function onAuthenticationSuccess(Request $request, TokenInterface $token): RedirectResponse
    {
        // Obtenez l'utilisateur connecté
        $user = $token->getUser();
        
        // Vérifiez si l'utilisateur a le rôle d'administrateur
        if (in_array('ROLE_ADMIN', $user->getRoles())) {
            // Rediriger vers la page index
            return new RedirectResponse($this->router->generate('emploi_index'));
        }

        // Sinon, redirigez vers une autre page, comme la page de profil
        return new RedirectResponse($this->router->generate('emp'));
    }
}
?>