module.exports = {
  getAuth: jest.fn(() => {
    return {
      currentUser: null,
    };
  }),

  onAuthStateChanged: jest.fn((auth, callback) => {
    const user = null;
    callback(user);
    return jest.fn();
  }),

  signInWithEmailAndPassword: jest.fn(() => {
    return Promise.resolve({
      user: {
        uid: "test-user-123",
        email: "test@example.com",
      },
    });
  }),

  sendEmailVerification: jest.fn(() => Promise.resolve()),

  signInWithCustomToken: jest.fn(() => {
    return Promise.resolve({
      user: {
        uid: "test-user-123",
        email: "test@example.com",
      },
    });
  }),
};
