export const fetchGistList = async (userName: string, pageNo: number, perPage: number) => {
    try {
    const response = await fetch(
        `https://api.github.com/users/${userName}/gists?page=${pageNo}&per_page=${perPage}`,
        {
        headers: {
            Authorization: `Bearer ${import.meta.env.VITE_GITHUB_TOKEN}`,
        },
        }
    );  
    if (!response.ok) throw new Error('Error fetching gist list');
    const data = await response.json();
    return data;
    } catch (error) {
        throw new Error('Error fetching gist list');
    }
};

export const fetchForks = async (forksUrl: string) => {
    const response = await fetch(forksUrl, {
        headers: {
            Authorization: `Bearer ${import.meta.env.VITE_GITHUB_TOKEN}`,
        },
    });
    const data = await response.json();
    return data;
}