const createFirebaseUser = () => ({
  uid: "test-user-123",
  email: "test@example.com",
  emailVerified: true,
  reload: jest.fn().mockResolvedValue(undefined),
  getIdToken: jest.fn().mockResolvedValue("mock-token"),
  getIdTokenResult: jest.fn().mockResolvedValue({
    claims: {
      role: "customer",
    },
  }),
});

export default {
  getAuth: jest.fn(() => ({
    currentUser: null,
    signOut: jest.fn().mockResolvedValue(undefined),
  })),

  onAuthStateChanged: jest.fn((auth, callback) => {
    callback(null);
    return jest.fn();
  }),

  signInWithEmailAndPassword: jest.fn().mockImplementation(createFirebaseUser),

  sendEmailVerification: jest.fn().mockResolvedValue(undefined),

  signInWithCustomToken: jest.fn().mockImplementation(createFirebaseUser),
};
