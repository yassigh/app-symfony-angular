<?php


namespace App\Entity;
use App\Entity\Classe; 
use App\Repository\EmploiRepository;
use Doctrine\DBAL\Types\Types;
use Symfony\Component\Serializer\Annotation\Groups;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: EmploiRepository::class)]
class Emploi
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups("emploi:read")]

    private ?int $id = null;
    #[Groups("emploi:read")]

    #[ORM\Column(length: 255)]
    private ?string $titre = null;
    #[Groups("emploi:read")]

    #[ORM\Column(type: Types::TIME_MUTABLE)] 
    private ?\DateTimeInterface $startTime = null;
    #[Groups("emploi:read")]
    #[ORM\Column(type: Types::TIME_MUTABLE)] 
    private ?\DateTimeInterface $endTime = null;
    #[Groups("emploi:read")]
     
    #[ORM\Column(length: 255)]
    private ?string $recurrencePattern = null;
 #[Groups("emploi:read")]
         
             #[ORM\Column(type: Types::STRING, length: 255)]
             private ?string $salle = null;
    #[Groups("emploi:read")]
    
    #[ORM\Column(type: 'string', length: 10)]
    private ?string $jour = null;

    public function getJour(): ?string
    {
        return $this->jour;
    }

    public function setJour(string $jour): self
    {
        $this->jour = $jour;

        return $this;
    }
    // Getter et Setter pour salle
    public function getSalle(): ?string
    {
        return $this->salle;
    }

    public function setSalle(string $salle): self
    {
        $this->salle = $salle;
        return $this;
    }

   
    #[ORM\ManyToOne(targetEntity: Classe::class)]
    #[ORM\JoinColumn(nullable: false)]
    #[JoinColumn(name: "classe_id", referencedColumnName: "id")]
    #[Groups("emploi:read")] 
    private ?Classe $classe = null;
    

#[Groups("emploi:read")]
#[ORM\Column(length: 255)]
private ?string $nomEnseignant = null;


public function getClasse(): ?Classe  // Vérifiez que cette méthode est présente
{
    return $this->classe;
}

public function setClasse(?Classe $classe): self  // Vérifiez que cette méthode est présente
{
    $this->classe = $classe;
    return $this;
}
    public function getId(): ?int
    {
        return $this->id;
    }

    public function getTitre(): ?string
    {
        return $this->titre;
    }

    public function setTitre(string $titre): self
    {
        $this->titre = $titre;
        return $this;
    }

    public function getStartTime(): ?\DateTimeInterface
    {
        return $this->startTime;
    }

    public function setStartTime(\DateTimeInterface $startTime): self
    {
        $this->startTime = $startTime;
        return $this;
    }

    public function getEndTime(): ?\DateTimeInterface
    {
        return $this->endTime;
    }

    public function setEndTime(\DateTimeInterface $endTime): self
    {
        $this->endTime = $endTime;
        return $this;
    }

    public function getRecurrencePattern(): ?string
    {
        return $this->recurrencePattern;
    }

    public function setRecurrencePattern(?string $recurrencePattern): self
    {
        $this->recurrencePattern = $recurrencePattern;
        return $this;
    }

   
    public function getNomEnseignant(): ?string
    {
        return $this->nomEnseignant;
    }

    public function setNomEnseignant(?string $nomEnseignant): self
    {
        $this->nomEnseignant = $nomEnseignant;
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
}

