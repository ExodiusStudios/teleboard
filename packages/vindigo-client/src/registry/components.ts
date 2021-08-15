import Avatar from '../components/Avatar.vue';
import Draggable from 'vuedraggable';
import FileUpload from '../components/FileUpload.vue';
import LanguagePicker from '../components/LanguagePicker.vue';
import LoadingSpinner from '../components/LoadingSpinner.vue';
import Logo from '../components/Logo.vue';
import MarkdownEditor from '../components/MarkdownEditor.vue';
import Pagination from '../components/Pagination.vue';
import ProjectList from '../components/ProjectList.vue';
import SectionTitle from '../components/SectionTitle.vue';
import Spacer from '../components/Spacer.vue';
import TeamIcon from '../components/TeamIcon.vue';
import Toolbar from '../components/Toolbar.vue';
import Vue from 'vue';

/**
 * Define all Vue components and directives
 */
export function registerComponents() {
	Vue.component('LanguagePicker', LanguagePicker);
	Vue.component('LoadingSpinner', LoadingSpinner);
	Vue.component('MarkdownEditor', MarkdownEditor);
	Vue.component('SectionTitle', SectionTitle);
	Vue.component('ProjectList', ProjectList);
	Vue.component('Pagination', Pagination);
	Vue.component('FileUpload', FileUpload);
	Vue.component('Draggable', Draggable);
	Vue.component('TeamIcon', TeamIcon);
	Vue.component('Toolbar', Toolbar);
	Vue.component('Spacer', Spacer);
	Vue.component('Avatar', Avatar);
	Vue.component('Logo', Logo);
}