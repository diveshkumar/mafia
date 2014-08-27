<?php
/**
 * @package PII
 * @version 1.0
 */
/*
  Plugin Name: PII Manager
  Plugin URI:
  Description: This plugin lets wordpress admin decide what fields can be encrypted while storing to the database.
  Author: Divesh Kumar, Madhu Sudan
  Version: 1.0
 */
define('PII_SALT', '@#dsas47321@#712');
define('PII_USER_SALT', '&#$#*&%$');
define('PII_USER_IV', '&#Go9yV$');
define('PII_ENCRYPTION_METHOD', 'AES-256-CBC');
define('URLS_TO_SHOW_USER_EMAIL', serialize(array(site_url('wp-admin/users.php'), site_url('wp-admin/user-edit.php'), site_url('wp-admin/profile.php'), site_url('wp-admin/network/users.php'), site_url('wp-admin/network/user-edit.php'))));
require_once dirname(__FILE__) . '/includes/EncryptDecrypt.php';
require_once dirname(__FILE__) . '/includes/MenuHandler.php';


include_once( ABSPATH . 'wp-admin/includes/plugin.php' );
if (is_plugin_active('pii/pii.php')) {
//==================== PII code starts here ====================
    add_action('set_current_user', 'my_custom_user', 666);
    add_action('sanitize_email', 'my_custom_user_email', 666, 2);

    /**
     * Overrides curent user object.
     * @global object $current_user
     * @global object $wpdb
     * @param int $id
     * @param string $name
     * @return boolean|\WP_User
     */
    function my_custom_user($id, $name = '') {
        global $current_user;
        global $wpdb;

        if (isset($current_user) && ( $current_user instanceof WP_User ) && ( $id == $current_user->ID ))
            return $current_user;

        $current_user = get_user_by('id', get_current_user_id());

        if (!$user_data_from_db = $wpdb->get_row($wpdb->prepare("SELECT * FROM $wpdb->users WHERE id = %s", $current_user->ID)))
            return false;
        //print_r($current_user);
        // Decrypt PII data
        $user_data_from_db = decrypt_pii_data($user_data_from_db);
        // Injecting decrypted data to CURRENT USER OBJECT
        $current_user->data = $user_data_from_db;
        //print_r($current_user->last_name);exit;

        return $current_user;
    }

    /**
     * Sanitizes user email.
     * @param type $temp
     * @param type $email
     * @return type
     */
    function my_custom_user_email($temp, $email) {
        $encryption = new encryptDecrypt();
        if (!in_array(getCurrentUrl(), unserialize(constant('URLS_TO_SHOW_USER_EMAIL')))) {
            $email = $email;
        } else {
            if (!empty($_POST['email'])) {
                $email = $encryption->encrypt($email);
            } else {
                $email = $encryption->decrypt($email);
            }
        }
        return $email;
    }

    function getCurrentUrl() {
        $pageURL = 'http';
        if ($_SERVER["HTTPS"] == "on") {
            $pageURL .= "s";
        }
        $pageURL .= "://";
        $page_url = parse_url($_SERVER["REQUEST_URI"]);
        if ($_SERVER["SERVER_PORT"] != "80") {
            $pageURL .= $_SERVER["SERVER_NAME"] . ":" . $_SERVER["SERVER_PORT"] . $page_url['path'];
        } else {
            $pageURL .= $_SERVER["SERVER_NAME"] . $page_url['path'];
        }
        return $pageURL;
    }

    /**
     * Gets data by field from user object.
     * @global object $wpdb
     * @param type $field
     * @param type $value
     * @return boolean
     */
    function get_data_by($field, $value) {
        global $wpdb;

        if ('id' == $field) {
            // Make sure the value is numeric to avoid casting objects, for example,
            // to int 1.
            if (!is_numeric($value))
                return false;
            $value = intval($value);
            if ($value < 1)
                return false;
        } else {
            $value = trim($value);
        }

        if (!$value)
            return false;

        switch ($field) {
            case 'id':
                $user_id = $value;
                $db_field = 'ID';
                break;
            case 'slug':
                $user_id = wp_cache_get($value, 'userslugs');
                $db_field = 'user_nicename';
                break;
            case 'email':
                $user_id = wp_cache_get($value, 'useremail');
                $db_field = 'user_email';
                break;
            case 'login':
                $value = sanitize_user($value);
                $user_id = wp_cache_get($value, 'userlogins');
                $db_field = 'user_login';
                break;
            default:
                return false;
        }

        if (false !== $user_id) {
            if ($user = wp_cache_get($user_id, 'users'))
                return $user;
        }

        if (!$user = $wpdb->get_row($wpdb->prepare(
                        "SELECT * FROM $wpdb->users WHERE $db_field = %s", $value
                )))
            return false;
        // Decrypt PII data
        $user = decrypt_pii_data($user);
        
        update_user_caches($user);
        return $user;
    }

    add_filter('get_userdata', 'custom_get_user_by', 6666, 1);
    add_filter('get_user_metadata', 'custom_get_user_metadata', 666, 4);
    add_action('init', 'custom_user_obj', 666);
    add_action('edit_user_profile_update', 'my_custom_edit_user_profile_update', -1, 1);
    add_action('personal_options_update', 'my_custom_edit_user_profile_update', -1, 1);
    add_action('show_user_profile', 'my_custom_profile_fields');
    add_action('edit_user_profile', 'my_custom_profile_fields');

    /**
     * Encrypt User Meta Data.
     * @param type $user_id
     */
    function my_custom_edit_user_profile_update($user_id) {
        
        $pii_fields = get_option('pii_fields');
        $meta_fields = !empty($pii_fields) ? preg_grep("/meta_/i", $pii_fields) : '';
        if(is_array($meta_fields) && !empty($meta_fields)){
            array_walk($meta_fields, get_meta_field_name);
        }
       
        if (!empty($meta_fields) && !empty($_POST) && $user_id) {
            $encryption = new EncryptDecrypt();
            foreach ($meta_fields as $meta_field){
                $_POST[$meta_field] = !empty($_POST[$meta_field]) ? $encryption->encrypt(esc_attr($_POST[$meta_field])) : '';
            }
        }
    }

    /**
     * Apply filters on current user object for Edit user screen.
     */
    function custom_user_obj() {
        if (in_array(getCurrentUrl(), unserialize(constant('URLS_TO_SHOW_USER_EMAIL')))) {
            $user_id = !empty($_GET['user_id']) ? $_GET['user_id'] : FALSE;
            if (!$user_id) {
                $user_id = get_current_user_id();
            }
            apply_filters('get_userdata', $user_id);
        }
    }

    function custom_get_user_by($value = 0, $field = 'id') {
        $userdata = get_data_by($field, $value);

        if (!$userdata)
            return false;

        $user = new WP_User;
        $user->init($userdata);
        
        // Decrypt PII data
        $user = decrypt_pii_data($user);
        
        return $user;
    }

    function custom_get_user_metadata($temp = null, $object_id, $meta_key, $single) {
        global $wpdb;
        $pii_fields = get_option('pii_fields');
        $meta_fields = !empty($pii_fields) ? preg_grep("/meta_/i", $pii_fields) : '';
        if(is_array($meta_fields) && !empty($meta_fields)){
            array_walk($meta_fields, get_meta_field_name);
        }
        //print_r($meta_fields);
        if (!empty($meta_fields) && in_array($meta_key, $meta_fields)) {
            if (!$custom_user = $wpdb->get_results($wpdb->prepare("SELECT meta_value FROM $wpdb->usermeta WHERE user_id = %s AND meta_key = %s", array($object_id, $meta_key)), OBJECT)) {
                return false;
            }
            $encryption = new encryptDecrypt();
            return $encryption->decrypt($custom_user[0]->meta_value);
        }
    }
    // Fix for User's personal email address on his own profile page
    function my_custom_profile_fields() {
        $current_url = getCurrentUrl();
        if (site_url('wp-admin/profile.php') == $current_url) {
            global $current_user;
            ?>

            <input type="hidden" name="decrypted_email" id="decrypted_email" value="<?php echo esc_attr($current_user->data->user_email); ?>" class="regular-text" />
            <script type="text/javascript">
                jQuery(document).ready(function() {
                    if (jQuery('#email') && jQuery('#decrypted_email')) {
                        jQuery('#email').val(jQuery('#decrypted_email').val());
                    }
                });
            </script>
            <?php
        }
    }
    
    function decrypt_pii_data($obj=FALSE){
        // get PII fields
        $pii_fields = get_option('pii_fields');
        if (!empty($pii_fields) && $obj) {
            $encryption = new encryptDecrypt();
            foreach ($pii_fields as $pii_field) {
                //print_r($user_data_from_db);
                $obj->$pii_field = !empty($obj->$pii_field) ? $encryption->decrypt($obj->$pii_field) : '';
            }
        }
        return $obj;
    }
    
    function get_meta_field_name(&$val){
        if(!empty($val) && is_string($val)){
            $val = str_replace('meta_', '', $val);
        }
    }

}
