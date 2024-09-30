'use client';
import Home from '@/modules/Home';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(
  'pk_test_51K4bbiLS4m7jUpM9neeqrdqlBKMihMUgs3gngWlFgWn4xoo4lNNHwjIWfHSy8opUkHHTN3Jv2d33K57vPR6d5inR00MfTFidJg',
);

export default function HomePage() {
  return (
    <Elements
      stripe={stripePromise}
      options={{
        // passing the client secret obtained from the server
        clientSecret:
          'pi_3Q12bULS4m7jUpM90IRzeMIy_secret_oje9We3swG1APhOnM0mAN7Lm7',
      }}
    >
      <Home />
    </Elements>
  );
}
