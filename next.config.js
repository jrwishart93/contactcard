module.exports = {
  async redirects() {
    return [
      {
        source: '/api/rtc/new',
        destination: '/crash/new',
        permanent: true,
      },
      {
        source: '/rtc/:path*',
        destination: '/crash/:path*',
        permanent: true,
      },
      {
        source: '/statements/:path*',
        destination: '/statement/:path*',
        permanent: true,
      },
    ];
  },
};
