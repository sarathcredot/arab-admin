import { gql, useMutation, MutationFunction } from '@apollo/client';

interface GetAdminSignedFileUrlInput {
    fileURL: string;
    mimeType: string;
}

interface GetAdminSignedFileUrlData {
    getAdminSignedFileUrl: {
        url: string;
    };
}

const GET_ADMIN_SIGNED_URL = gql`
  mutation GetAdminSignedFileUrl($input: GetAdminSignedFileUrlInput!) {
    getAdminSignedFileUrl(input: $input) {
      url
    }
  }
`;

type GetAdminSignedUrlMutationFn = MutationFunction<GetAdminSignedFileUrlData, { input: GetAdminSignedFileUrlInput }>;

export const useFetchSignedUrl = (): GetAdminSignedUrlMutationFn => {
    const [getAdminSignedUrlMutation] = useMutation<GetAdminSignedFileUrlData, { input: GetAdminSignedFileUrlInput }>(GET_ADMIN_SIGNED_URL);
    return getAdminSignedUrlMutation;
};

export const fetchSignedUrl = async (getAdminSignedUrl: GetAdminSignedUrlMutationFn, url: string, mimeType: string): Promise<string | undefined> => {
    if (!mimeType || !url) {
        console.error("MIME type or URL is null or undefined.");
        return undefined;
    }

    try {
        const { data } = await getAdminSignedUrl({
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
