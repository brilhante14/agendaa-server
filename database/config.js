module.exports = {
  aws_table_name: 'FaltasPorTurma',
  aws_local_config: {
    //Provide details for local configuration
  },
  aws_remote_config: {
    accessKeyId: process.env.ACCESS_KEY_ID,
    accessSecretKey: process.env.ACCESS_SECRET_KEY,
    region: 'us-east-1',
  }
};