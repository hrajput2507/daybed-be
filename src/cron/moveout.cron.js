const cron = require('node-cron');
const sequelize = require('./path-to-sequelize-instance'); // Import your Sequelize instance

// Schedule a cron job to run every day at midnight
cron.schedule('0 0 * * *', async () => {
  console.log('Running a daily check for approved reservations at midnight');

  const transaction = await sequelize.transaction();

  try {
    // Fetch all approved reservations that have a move-out date of today or earlier
    const approvedReservationsQuery = `
      SELECT * FROM public.reservations
      WHERE status = 'approved' AND end_date <= CURRENT_DATE`;
    const approvedReservations = await sequelize.query(approvedReservationsQuery, {
      type: sequelize.QueryTypes.SELECT,
      transaction
    });

    for (const reservation of approvedReservations) {
      // Update the status of the old room or unit to 'vacant'
      const updateEntityStatusQuery = (reservation.entity_type === 'unit') ?
        'UPDATE public.units SET type = \'vacant\' WHERE id = :entity_id' :
        'UPDATE public.rooms SET room_status = \'vacant\' WHERE id = :entity_id';
      await sequelize.query(updateEntityStatusQuery, {
        type: sequelize.QueryTypes.UPDATE,
        replacements: { entity_id: reservation.old_entity_id },
        transaction
      });
    }

    // Commit transaction
    await transaction.commit();
  } catch (error) {
    // Rollback transaction in case of error
    await transaction.rollback();
    console.error('Error during cron job execution:', error);
  }
});