<?php


namespace App\Form;

use App\Entity\Emploi;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\Extension\Core\Type\ChoiceType;
use Symfony\Component\Form\Extension\Core\Type\TimeType;
use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use Symfony\Component\Form\Extension\Core\Type\DateTimeType;
use App\Entity\Classe;
class EmploiType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('titre', TextType::class, [
                'label' => 'Titre de l\'emploi du temps',
            ])
            
            ->add('classe', EntityType::class, [
                'class' => Classe::class, // Assurez-vous que la classe est correctement spécifiée
                'choice_label' => 'nom', // Assurez-vous que 'nom' est un champ existant dans votre entité Classe
                'placeholder' => 'Choisir une classe',
            ])
        
            ->add('startTime', DateTimeType::class, [
                'widget' => 'single_text', // Utiliser un seul champ pour la date et l'heure
                'input' => 'datetime', // Prendre l'entrée comme un objet DateTime
                'required' => true,
                'label' => 'Heure de début', // Ajoutez un label pour le champ
            ])
            
            ->add('endTime', TimeType::class, [
                'widget' => 'single_text',
                'input' => 'datetime',
                'label' => 'Heure de fin'
            ])
            ->add('recurrencePattern', ChoiceType::class, [
                'label' => 'Modèle de récurrence',
                'choices' => [
                    'Aucun' => null,
                    'Quotidien' => 'quotidien',
                    'Hebdomadaire' => 'hebdomadaire',
                    'Mensuel' => 'mensuel',
                ],
                'required' => false,
            ])
            ->add('salle', TextType::class, [
                'label' => 'Salle',
                'required' => true,
            ])
            ->add('jour', ChoiceType::class, [
                'choices' => [
                    'Lundi' => 'Lundi',
                    'Mardi' => 'Mardi',
                    'Mercredi' => 'Mercredi',
                    'Jeudi' => 'Jeudi',
                    'Vendredi' => 'Vendredi',
                    'Samedi' => 'Samedi',
                    'Dimanche' => 'Dimanche',
                ],
                'placeholder' => 'Sélectionnez un jour',
                'label' => 'Jour',
            ])
            ->add('nomEnseignant', TextType::class, [
                'label' => 'Nom de l\'enseignant',
                'required' => false,
                'attr' => [
                    'placeholder' => 'Entrez le nom de l\'enseignant',
                    'class' => 'form-control'
                ],
            ]);
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'data_class' => Emploi::class,
        ]);
    }
}
