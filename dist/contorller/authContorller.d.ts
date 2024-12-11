export declare const getAuthMenuList: () => Promise<({
    path: string;
    name: string;
    component: string;
    meta: {
        isKeepAlive: boolean;
        isHide: boolean;
        title: string;
        icon: string;
    };
    redirect?: undefined;
    children?: undefined;
} | {
    path: string;
    name: string;
    redirect: string;
    meta: {
        isKeepAlive: boolean;
        isHide: boolean;
        title: string;
        icon: string;
    };
    children: {
        path: string;
        name: string;
        component: string;
        meta: {
            isKeepAlive: boolean;
            isHide: boolean;
            title: string;
            icon: string;
        };
    }[];
    component?: undefined;
} | {
    path: string;
    name: string;
    component: string;
    redirect: string;
    meta: {
        isKeepAlive: boolean;
        isHide: boolean;
        title: string;
        icon: string;
    };
    children: ({
        path: string;
        name: string;
        component: string;
        meta: {
            isKeepAlive: boolean;
            isHide: boolean;
            title: string;
            icon: string;
        };
        children: {
            path: string;
            name: string;
            component: string;
            meta: {
                isKeepAlive: boolean;
                isHide: boolean;
                title: string;
            };
        }[];
    } | {
        path: string;
        name: string;
        component: string;
        meta: {
            isKeepAlive: boolean;
            isHide: boolean;
            title: string;
            icon: string;
        };
        children: {
            path: string;
            name: string;
            component: string;
            meta: {
                isKeepAlive: boolean;
                isHide: boolean;
                title: string;
                icon: string;
            };
        }[];
    })[];
})[]>;
