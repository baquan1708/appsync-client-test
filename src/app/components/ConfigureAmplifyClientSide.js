"use client";

import { Amplify } from "aws-amplify";
import config from '../../aws-exports';

Amplify.configure({
  ...config,
  Auth: {
    Cognito: {
      userPoolId: 'ap-northeast-1_8Jp31g8LW',
      userPoolClientId: '5e4m27v4euv9gjheo085vcleqd',
      loginWith: {
        username: true,
        email: false,
        phone: false,
      },
      passwordFormat: {
        minLength: 6
      },
      identityPoolId: 'ap-northeast-1:458bbcc3-7654-4b78-abee-bfec78f48874'

    }
  }
}, { ssr: true });

export default function ConfigureAmplifyClientSide() {
  return null;
}
