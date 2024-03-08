import { gql, useMutation, MutationFunction } from '@apollo/client';

interface GetSignedFileUrlInput {
    fileURL: string;
    mimeType: string;
}

interface GetSignedFileUrlData {
    getAdminSignedFileUrl: {
        url: string;
    };
}

const GET_SIGNED_URL_MUTATION = gql`
mutation GetAdminSignedFileUrl($input: GetAdminSignedFileUrlInput!) {
  getAdminSignedFileUrl(input: $input) {
    url
  }
}
`;

type GetSignedUrlMutationFn = MutationFunction<GetSignedFileUrlData, { input: GetSignedFileUrlInput }>;

export const useFetchSignedUrl = (): GetSignedUrlMutationFn => {
    const [getSignedUrlMutation] = useMutation<GetSignedFileUrlData, { input: GetSignedFileUrlInput }>(GET_SIGNED_URL_MUTATION);
    return getSignedUrlMutation;
};

export const fetchSignedUrl = async (getSignedUrl: GetSignedUrlMutationFn, url: string, mimeType: string): Promise<string | undefined> => {
    if (!mimeType || !url) {
        console.error("MIME type or URL is null or undefined.");
        return undefined;
    }

    try {
        const { data } = await getSignedUrl({
            variables: {
                input: {
                    fileURL: url,
                    mimeType: mimeType
                }
            }
        });
        return data?.getAdminSignedFileUrl?.url;
    } catch (error) {
        console.error("Error fetching signed URL:", error);
        return undefined;
    }
};
