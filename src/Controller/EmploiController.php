<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use App\Entity\Emploi;
use App\Entity\Classe; 
use App\Form\EmploiType;
use App\Repository\EmploiRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use App\Repository\ClasseRepository;

#[Route('/api/emploi')]
class EmploiController extends AbstractController
{
    #[Route('/', name: 'emploi_index', methods: ['GET'])]
    public function index(Request $request, EmploiRepository $emploiRepository, SerializerInterface $serializer): JsonResponse
    {  
        $selectedClasse = $request->query->get('nom.classe');
        $selectedEnseignant = $request->query->get('enseignant');
        $selectedTitre = $request->query->get('titre');
        $selectedSalle = $request->query->get('salle');
    
        // Créer un query builder pour appliquer les filtres
        $queryBuilder = $emploiRepository->createQueryBuilder('e')
        ->leftJoin('e.classe', 'c') 
          ->addSelect('c');  
        if ($selectedClasse) {
            $queryBuilder->andWhere('e.classe = :classe')
                         ->setParameter('classe', $selectedClasse);
        }
    
        if ($selectedEnseignant) {
            $queryBuilder->andWhere('e.nomEnseignant = :enseignant')
                         ->setParameter('enseignant', $selectedEnseignant);
        }
    
        if ($selectedTitre) {
            $queryBuilder->andWhere('e.titre LIKE :titre')
                         ->setParameter('titre', '%' . $selectedTitre . '%');
        }
    
        if ($selectedSalle) {
            $queryBuilder->andWhere('e.salle LIKE :salle')
                         ->setParameter('salle', '%' . $selectedSalle . '%');
        }
        $emplois = $queryBuilder->getQuery()->getResult();
        $groupedEmplois = [];
        foreach ($emplois as $emploi) {
            $classeName = $emploi->getClasse() ? $emploi->getClasse()->getNom() : 'Sans classe';
            if (!isset($groupedEmplois[$classeName])) {
                $groupedEmplois[$classeName] = [];
            }
            $groupedEmplois[$classeName][] = $emploi;
        }$jsonContent = $serializer->serialize($groupedEmplois, 'json', ['groups' => 'emploi:read']);
        return new JsonResponse($jsonContent, Response::HTTP_OK, [], true);
    }

    #[Route('/emp', name: 'emp', methods: ['GET'])]
    public function inde(Request $request, EmploiRepository $emploiRepository, SerializerInterface $serializer): JsonResponse
    {
        $selectedClasse = $request->query->get('classe');
        $selectedEnseignant = $request->query->get('nomEnseignant');
        $selectedTitre = $request->query->get('titre');
        $selectedSalle = $request->query->get('salle');

        $queryBuilder = $emploiRepository->createQueryBuilder('e');

        if ($selectedClasse) {
            $queryBuilder->andWhere('e.classe = :classe')
                         ->setParameter('classe', $selectedClasse);
        }

        if ($selectedEnseignant) {
            $queryBuilder->andWhere('e.nomEnseignant = :nomEnseignant')
                         ->setParameter('nomEnseignant', $selectedEnseignant);
        }

        if ($selectedTitre) {
            $queryBuilder->andWhere('e.titre LIKE :titre')
                         ->setParameter('titre', '%' . $selectedTitre . '%');
        }

        if ($selectedSalle) {
            $queryBuilder->andWhere('e.salle LIKE :salle')
                         ->setParameter('salle', '%' . $selectedSalle . '%');
        }

        $emplois = $queryBuilder->getQuery()->getResult();

        // Grouper les emplois par classe
        $groupedEmplois = [];
        foreach ($emplois as $emploi) {
            $emploi->getClasse(); // Force le chargement de la classe, si nécessaire
        }
        // Sérialiser les données en JSON
        $jsonContent = $serializer->serialize($groupedEmplois, 'json', ['groups' => 'emploi:read']);

        return new JsonResponse($jsonContent, JsonResponse::HTTP_OK, [], true);
    }
    #[Route('/new', name: 'emploi_new', methods: ['POST'])]
    public function new(Request $request, EntityManagerInterface $entityManager, ClasseRepository $classeRepository): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
    
        // Vérifiez si toutes les données nécessaires sont présentes
        if (!isset($data['jour'], $data['titre'], $data['nomEnseignant'], $data['startTime'], $data['endTime'], $data['salle'])) {
            return new JsonResponse(['error' => 'Données manquantes'], Response::HTTP_BAD_REQUEST);
        }
    
     
        try {
            $startTime = new \DateTime($data['startTime']); // Convert string to DateTime
            $endTime = new \DateTime($data['endTime']);
        } catch (\Exception $e) {
            return new JsonResponse(['error' => 'Format de date invalide'], Response::HTTP_BAD_REQUEST);
        }
    
       
        $emploi = new Emploi();
    
        // Initialiser les champs
        $emploi->setJour($data['jour']);
        $emploi->setTitre($data['titre']);
        $emploi->setNomEnseignant($data['nomEnseignant']);
        $emploi->setStartTime($startTime);
        $emploi->setEndTime($endTime);
        $emploi->setSalle($data['salle']);
        
        if (isset($data['recurrencePattern'])) {
            $emploi->setRecurrencePattern($data['recurrencePattern']);
        }
    
        // Lien avec la classe si elle est specifiee
        if (isset($data['classeId'])) {
            $classe = $classeRepository->find($data['classeId']);
            if ($classe) {
                $emploi->setClasse($classe);
            } else {
                return new JsonResponse(['error' => 'Classe non trouvée'], Response::HTTP_BAD_REQUEST);
            }
        }
    
       
        $entityManager->persist($emploi);
        $entityManager->flush();
    
        return new JsonResponse(['status' => 'Emploi créé avec succès'], Response::HTTP_CREATED);
    }
    
    
    #[Route('/{id}/edit', name: 'emploi_edit', methods: ['PUT'])] // Changez le méthode en PUT
    public function edit(Request $request, Emploi $emploi, EntityManagerInterface $entityManager): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
    
     
        if (isset($data['jour'])) {
            $emploi->setJour($data['jour']);
        }
        if (isset($data['titre'])) {
            $emploi->setTitre($data['titre']);
        }
        if (isset($data['nomEnseignant'])) {
            $emploi->setNomEnseignant($data['nomEnseignant']);
        }
        if (isset($data['startTime'])) {
            $emploi->setStartTime(new \DateTime($data['startTime']));
        }
        if (isset($data['endTime'])) {
            $emploi->setEndTime(new \DateTime($data['endTime']));
        }
        if (isset($data['salle'])) {
            $emploi->setSalle($data['salle']);
        }
        if (isset($data['recurrencePattern'])) {
            $emploi->setRecurrencePattern($data['recurrencePattern']);
        }
    
        $entityManager->flush();
    
        return new JsonResponse(['status' => 'Emploi modifie avec succès'], Response::HTTP_OK);
    }
    #[Route('/classes', name: 'get_classes', methods: ['GET'])]
    public function getClasses(ClasseRepository $classeRepository): JsonResponse
    {
        $classes = $classeRepository->getAllClasses();
        if (empty($classes)) {
            $this->get('logger')->error('Aucune classe trouvee.');
        }
        return $this->json($classes);
    }
    
    #[Route('/{id}', name: 'emploi_show', methods: ['GET'])]
    public function show(int $id, EmploiRepository $emploiRepository, SerializerInterface $serializer): JsonResponse
    {
        $emploi = $emploiRepository->find($id);
    
        if (!$emploi) {
            return new JsonResponse(['error' => 'Emploi non trouvé'], Response::HTTP_NOT_FOUND);
        }
    
        $jsonContent = $serializer->serialize($emploi, 'json', ['groups' => 'emploi:read']);
        return new JsonResponse($jsonContent, Response::HTTP_OK, [], true);
    }


    #[Route('/delete/{id}', name: 'emploi_delete', methods: ['DELETE'])]
public function delete(Emploi $emploi, EntityManagerInterface $entityManager): JsonResponse
{
    if (!$emploi) {
        return new JsonResponse(['error' => 'Emploi non trouvé'], Response::HTTP_NOT_FOUND);
    }

  
    $entityManager->remove($emploi);
    $entityManager->flush();

    return new JsonResponse(['status' => 'Emploi supprimé avec succès'], Response::HTTP_OK);
}

}
