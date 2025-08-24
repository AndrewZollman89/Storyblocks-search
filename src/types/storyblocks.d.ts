export interface Asset {
    id: number;
    title: string;
    type: string;
    contentClass: string;
    thumbnail_url: string;
    is_new?: boolean;
    categories?: string[];
    keywords?: string[];
    description?: string | null;
    expriation_date?: string | null;
    content_id?: number;
    url_id?: string;
    asset_id?: string;
}

export interface ImageAsset extends Asset {
    preview_url: string;
    small_preview_url?: string;
    download_formats?: {
        JPG: {
            format_name: string;
            file_size_bytes: number;
            width: number;
            height: number;
        }
    }
    aspect_ratio?: string;
    is_editorial?: boolean;
    has_talent_released?: boolean;
    has_property_released?: boolean;
}

export interface VideoAsset extends Asset {
    preview_urls: {
        _180p: string;
        _360p: string;
        _480p: string;
        _720p: string;
    };
    duration: number;
    durationMs: number;
    download_formats?: {
        MP4: {
            format_name: string;
            file_size_bytes: number;
            width: number;
            height: number;
            bitrate_kbps: number;
            frame_rate: number;
            video_codec: string;
            resolution: number;
        }
    };
    has_alpha?: boolean;
    contributor?: {
        username: string;
    };
    is_editorial?: boolean;
    has_talent_released?: boolean;
    has_property_released?: boolean;
}

export interface AudioAsset extends Asset {
    preview_url: string;
    waveform_url?: string;
    duration: number;
    durationMs: number;
    bpm?: number | null;
    download_formats?: {
        MP3?: {
            format_name: string;
            file_size_bytes: number;
            bitrate_kbps: number;
        };
        WAV?: {
            format_name: string;
            file_size_bytes: number;
            bitrate_kbps: number;
        };
    };
    artists?: string[];
    topTags?: [
        {
            tag_id: number;
            tag_name: string;
            tag_url_id: string;
            tag_position: number;
            tag_type: number;
            tag_value: string;
        }
    ]
}