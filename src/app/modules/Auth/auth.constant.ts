export const userSelectFields = {
  Admin: {
    select: {
      id: true,
      name: true,
      profilePhoto: true,
    },
  },
  Vendor: {
    select: {
      id: true,
      shopName: true,
      isBlacklisted: true,
      logo: true,
      description: true,
    },
  },
  Customer: {
    select: {
      id: true,
      name: true,
      profilePhoto: true,
    },
  },
};
