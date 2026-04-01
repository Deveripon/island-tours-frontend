export {
    handleCustomerSignup,
    handleCustomerSignIn,
    updateB2cCustomer,
    sendOtpToCustomerEmail,
    resendOtpToCustomerEmail,
    verifyCustomerOtp,
    updateForgottenPasswordOfCustomer,
    resetCustomerPassword
} from './update';

export {
    getB2cCustomers,
    getB2cCustomerById,
    getCustomerByEmail
} from './read';
