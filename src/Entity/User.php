<?php
namespace App\Entity;

use App\Repository\UserRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;
use Symfony\Component\Security\Core\User\UserInterface;

#[ORM\Entity(repositoryClass: UserRepository::class)]
#[ORM\Table(name: '`user`')]
class User implements UserInterface, PasswordAuthenticatedUserInterface
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;
    #[Groups("emploi:read")]
    #[ORM\Column(length: 255)]
    private ?string $email = null;
    #[Groups("emploi:read")]
    #[ORM\Column(length: 255)]
    private ?string $nom = null;
    #[Groups("emploi:read")]
    #[ORM\Column(length: 255)]
    private ?string $prenom = null;
    #[Groups("emploi:read")]
    #[ORM\Column(type: "json")]
  
    private array $roles = []; // Défini comme tableau pour stocker plusieurs rôles

    #[ORM\Column(length: 255)]
    private ?string $password = null; // Mot de passe haché

    private ?string $plainPassword = null; // Mot de passe en clair (non mappé)

    // Getters et setters des attributs

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getEmail(): ?string
    {
        return $this->email;
    }

    public function setEmail(string $email): static
    {
        $this->email = $email;
        return $this;
    }

    public function getNom(): ?string
    {
        return $this->nom;
    }

    public function setNom(string $nom): static
    {
        $this->nom = $nom;
        return $this;
    }

    public function getPrenom(): ?string
    {
        return $this->prenom;
    }

    public function setPrenom(string $prenom): static
    {
        $this->prenom = $prenom;
        return $this;
    }

    // Méthodes de gestion des rôles

    /**
     * Renvoie les rôles de l'utilisateur.
     *
     * @return string[]
     */
    public function getRoles(): array
    {
        // garantit que chaque utilisateur a au moins ROLE_USER
        $roles = $this->roles;
        $roles[] = 'ROLE_USER';

        return array_unique($roles);
    }

    /**
     * Définit les rôles de l'utilisateur.
     *
     * @param string[] $roles
     */
    public function setRoles(array $roles): static
    {
        $this->roles = $roles;
        return $this;
    }

    public function getPassword(): ?string
    {
        return $this->password; // Renvoie le mot de passe haché
    }

    public function setPassword(string $password): static
    {
        $this->password = $password;
        return $this;
    }

    public function getPlainPassword(): ?string
    {
        return $this->plainPassword; // Renvoie le mot de passe en clair
    }

    public function setPlainPassword(?string $plainPassword): static
    {
        $this->plainPassword = $plainPassword; // Définit le mot de passe en clair
        return $this;
    }

    // Méthodes de l'interface UserInterface

    public function getUserIdentifier(): string
    {
        return $this->email; // Utiliser l'email comme identifiant de l'utilisateur
    }

    public function eraseCredentials(): void
    {
        // Si vous stockez des données sensibles, nettoyez-les ici
    }
}


?>