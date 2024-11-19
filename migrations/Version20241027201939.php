<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20241027201939 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE classe CHANGE id id INT AUTO_INCREMENT NOT NULL, ADD PRIMARY KEY (id)');
        $this->addSql('ALTER TABLE emploi DROP isrecurring, CHANGE classe_id classe_id INT NOT NULL');
        $this->addSql('ALTER TABLE emploi ADD CONSTRAINT FK_74A0B0FA8F5EA509 FOREIGN KEY (classe_id) REFERENCES classe (id)');
        $this->addSql('CREATE INDEX IDX_74A0B0FA8F5EA509 ON emploi (classe_id)');
        $this->addSql('ALTER TABLE user ADD roles JSON NOT NULL COMMENT \'(DC2Type:json)\', DROP role');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE classe MODIFY id INT NOT NULL');
        $this->addSql('DROP INDEX `primary` ON classe');
        $this->addSql('ALTER TABLE classe CHANGE id id INT NOT NULL');
        $this->addSql('ALTER TABLE emploi DROP FOREIGN KEY FK_74A0B0FA8F5EA509');
        $this->addSql('DROP INDEX IDX_74A0B0FA8F5EA509 ON emploi');
        $this->addSql('ALTER TABLE emploi ADD isrecurring TINYINT(1) NOT NULL, CHANGE classe_id classe_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE `user` ADD role VARCHAR(255) NOT NULL, DROP roles');
    }
}
