'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query('SET FOREIGN_KEY_CHECKS = 0;');
    await queryInterface.bulkDelete('peliculas', null, {});
    await queryInterface.sequelize.query('SET FOREIGN_KEY_CHECKS = 1;');

    await queryInterface.bulkInsert('peliculas', [
      {
        titulo: 'Oppenheimer',
        genero: 'Histórico / Drama',
        duracion: 180,
        clasificacion: '+15',
        sinopsis: 'La historia del físico J. Robert Oppenheimer y el desarrollo de la bomba atómica.',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        titulo: 'Spider-Man: Across the Spider-Verse',
        genero: 'Animación / Acción',
        duracion: 140,
        clasificacion: 'TE',
        sinopsis: 'Miles Morales es catapultado a través del Multiverso.',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        titulo: 'Dune: Part Two',
        genero: 'Ciencia Ficción',
        duracion: 166,
        clasificacion: '+12',
        sinopsis: 'Paul Atreides se une a Chani y a los Fremen mientras busca venganza.',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        titulo: 'The Batman',
        genero: 'Acción / Crimen',
        duracion: 176,
        clasificacion: '+15',
        sinopsis: 'Batman se adentra en el inframundo de Gotham tras un sádico asesino.',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        titulo: 'Interstellar',
        genero: 'Ciencia Ficción',
        duracion: 169,
        clasificacion: '+12',
        sinopsis: 'Un equipo de exploradores viaja a través de un agujero de gusano en el espacio.',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        titulo: 'Alien: Romulus',
        genero: 'Terror / Sci-Fi',
        duracion: 119,
        clasificacion: '+18',
        sinopsis: 'Jóvenes colonizadores espaciales se encuentran cara a cara con la forma de vida más aterradora.',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('peliculas', null, {});
  }
};

