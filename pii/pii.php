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
define('URLS_TO_SHOW_USER_EMAIL',  serialize(array(site_url('wp-admin/users.php'), site_url('wp-admin/user-edit.php'), site_url('wp-admin/profile.php'),site_url('wp-admin/network/users.php'), site_url('wp-admin/network/user-edit.php')))); 
require_once dirname(__FILE__) . '/includes/EncryptDecrypt.php'; 
require_once dirname(__FILE__) . '/includes/MenuHandler.php'; 


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

    $encryption = new encryptDecrypt();
    //print_r($user_data_from_db);
    $user_data_from_db->user_email = $encryption->decrypt($user_data_from_db->user_email);
    $user_data_from_db->user_nicename = $encryption->decrypt($user_data_from_db->user_nicename);
    $user_data_from_db->display_name = $encryption->decrypt($user_data_from_db->display_name);
    // Injecting decrypted data to CURRENT USER OBJECT
    $current_user->data = $user_data_from_db;
    //print_r($current_user);exit;

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
        if(!empty($_POST['email'])){
            $email = $encryption->encrypt($email);
        }else{ 
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
    
    $encryption = new encryptDecrypt();
    $user->user_login = $encryption->decrypt($user->user_login);
    $user->user_email = $encryption->decrypt($user->user_email);
    $user->user_nicename = $encryption->decrypt($user->user_login);
    $user->display_name = $encryption->decrypt($user->display_name);
    update_user_caches($user);
    return $user;
}
add_filter('get_userdata', 'custom_get_user_by', 6666, 1);
add_filter('get_user_metadata', 'custom_get_user_metadata', 666, 4);
add_action('init','custom_user_obj', 666);
add_action( 'edit_user_profile_update', 'my_custom_edit_user_profile_update',-1, 1);
add_action( 'personal_options_update', 'my_custom_edit_user_profile_update',-1, 1);
add_action( 'show_user_profile', 'my_custom_profile_fields' );
add_action( 'edit_user_profile', 'my_custom_profile_fields' );

/**
 * Encrypt User Meta Data.
 * @param type $user_id
 */
function my_custom_edit_user_profile_update($user_id){ 
    $encryption = new encryptDecrypt();
    if(!empty($_POST) && $user_id){
        $_POST['first_name'] = !empty($_POST['first_name']) ? $encryption->encrypt(esc_attr($_POST['first_name'])) : '';
        $_POST['last_name'] = !empty($_POST['last_name']) ? $encryption->encrypt(esc_attr($_POST['last_name'])) : '';
    }
}

/** 
 * Apply filters on current user object for Edit user screen.
 */
function custom_user_obj(){
    if(in_array(getCurrentUrl(), unserialize(constant('URLS_TO_SHOW_USER_EMAIL')))){
        $user_id = !empty($_GET['user_id']) ? $_GET['user_id'] : FALSE;
        if(!$user_id){
            $user_id = get_current_user_id();
        }
        apply_filters('get_userdata',$user_id);
    }
}

function custom_get_user_by($value=0,$field='id') {
    $userdata = get_data_by($field, $value);

    if (!$userdata)
        return false;

    $user = new WP_User;
    $user->init($userdata);
    // Fix for first_name, last_name and nickname
    $encryption = new encryptDecrypt();
    $user->user_email = $encryption->decrypt($user->user_email);
    $user->user_nicename = $encryption->decrypt($user->user_login);
    $user->display_name = $encryption->decrypt($user->display_name);
    $user->first_name = $encryption->decrypt($user->first_name);
    $user->last_name = $encryption->decrypt($user->last_name);
    $user->nickname = $encryption->decrypt($user->nickname);
    return $user;
}

function custom_get_user_metadata($temp=null, $object_id, $meta_key, $single){
    global $wpdb;
    if($meta_key == 'first_name' || $meta_key == 'last_name' || $meta_key == 'nickname'){
        static $custom_user;
        if (!$custom_user = $wpdb->get_results($wpdb->prepare("SELECT meta_value FROM $wpdb->usermeta WHERE user_id = %s AND meta_key = %s", array($object_id,$meta_key)), OBJECT)){
            return false;
        }
        $encryption = new encryptDecrypt();
        return $encryption->decrypt($custom_user[0]->meta_value);
    }
}

function my_custom_profile_fields(){
    $current_url = getCurrentUrl();
    if(site_url('wp-admin/profile.php') == $current_url){
    global $current_user; 
    ?>

            <input type="hidden" name="decrypted_email" id="decrypted_email" value="<?php echo esc_attr( $current_user->data->user_email ); ?>" class="regular-text" />
            <script type="text/javascript">
                jQuery( document ).ready(function(){
                    if(jQuery('#email') && jQuery('#decrypted_email')){
                        jQuery('#email').val(jQuery('#decrypted_email').val());
                    }
                });
            </script>
<?php
    }
}
