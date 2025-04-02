import { mount } from 'svelte';
import Popup from './Popup.svelte';
import './popup.css';

document.addEventListener('DOMContentLoaded', () => {
    const target = document.getElementById('app');
    if (target) {
        const module = mount(Popup, {target});
    } else {
        console.error('Failed to find #app element in popup.html');
    }
});