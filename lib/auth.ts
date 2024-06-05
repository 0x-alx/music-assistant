import { GetServerSidePropsContext, NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { GET, POST } from '../app/api/auth/[...nextauth]/route';

type ParametersGetServerSession =
    | []
    | [GetServerSidePropsContext['req'], GetServerSidePropsContext['res']]
    | [NextApiRequest, NextApiResponse];

export const getAuthSession = async (...parameters: ParametersGetServerSession) => {
    const session = await getServerSession(...parameters, GET);
    return session;
};