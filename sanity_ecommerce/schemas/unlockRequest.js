export default {
  name: 'unlockRequest',
  title: 'Unlock Request',
  type: 'document',
  fields: [
    {
      name: 'type',
      title: 'Type',
      type: 'string',
    },
    {
      name: 'userId',
      title: 'userId',
      type: 'string',
    },
    {
      name: 'imei',
      title: 'imei',
      type: 'string',
    },
    {
      name: 'sn',
      title: 'sn',
      type: 'string',
    },
    {
      name: 'notes',
      title: 'notes',
      type: 'string',
    },
    {
      name: 'completed',
      title: 'completed',
      type: 'boolean',
    },
  ],
};
