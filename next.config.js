module.exports = {
  async redirects() {
    return [
      {
        source: '/api/rtc/new',
        destination: '/rtc/new',
        permanent: true,
      },
    ];
  },
};
