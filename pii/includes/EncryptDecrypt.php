<?php

/**
 * @package PII
 * @file
 * This file handles the code for Encryption and Decryption of database fields
 * to apply PII.
 */

/**
 * Class manages Encryption/Decryption of Database fields.
 */

class EncryptDecrypt {

  /**
   * Member variables.
   */
  public $secret_key;
  public $secret_iv;
  public $iv;
  public $encrypt_method;
  public $encrypted_string;
  public $decrypted_string;
  public $menu;

  /**
   * Constructor.
   */
  public function __construct() {
    $this->secret_key = constant('PII_USER_SALT');
    $this->secret_iv = constant('PII_USER_IV');
    $this->encrypt_method = constant('PII_ENCRYPTION_METHOD');
    $this->iv = substr(hash('sha256', $this->secret_iv), 0, 16);
    $this->menu = new MenuHandler();
  }

  /**
   * This method encrypts a string.
   * 
   * @param String $string
   *  String to be encrypted.
   * @return Strying
   *  Encrypted String.
   */
  public function encrypt($string) {
    // Encrypt string and then apply base64 encoding.
    $this->encrypted_string = openssl_encrypt($string, $this->encrypt_method, $this->secret_key, 0, $this->iv);
    $base_encryption = base64_encode($this->encrypted_string);
    $this->encrypted_string = $base_encryption;
    // Encrypted string.
    return $this->encrypted_string;
  }

  /**
   * This method would return decrypted string.
   * 
   * @param String $string
   *  String to be decrypted.
   * @return String
   *  Decrypted String.
   */
  public function decrypt($string) {
    // If encrypted String is matched with decrypted data then 
    $base_decryption = openssl_decrypt(base64_decode($string), $this->encrypt_method, $this->secret_key, 0, $this->iv);
    // Matching string against encrypted and non encrypted.
    if ($this->encrypt($base_decryption) === $string) {
      $this->decrypted_string = $base_decryption;
    }
    else {
      $this->decrypted_string = $string;
    }
    return $this->decrypted_string;
  }

  /**
   * @method
   *  This method decrypts fields which are set under the settings page of PII.
   * @param type $fields
   */
  public function updateFields($fields) {
    // Decrypt all fields.
    //array_walk($fields, array($this, '_modifyUserData'));
    global $wpdb;
    //$fields = get_option('pii_fields');
    // Separating core fields. 
    $core_fields = !empty($fields) ? preg_grep("/meta_/i", $fields, PREG_GREP_INVERT) : '';
    // Separating Meta fields.
    $meta_fields = !empty($fields) ? preg_grep("/meta_/i", $fields) : '';
    // Applying encryption/decryption.
    $this->_modifyCoreUserFields($core_fields);
    $this->_modifyMetaUserFields($meta_fields);
  }

  /**
   * Modifying Core fields for encryption.
   * @global type $wpdb
   * @param type $fields
   */
  private function _modifyCoreUserFields($fields) {
    $users = get_users();
    $core_fields = $this->getCoreFields(TRUE);
    $this->_updateUser($users, $core_fields, FALSE);
    $users = get_users();
    $this->_updateUser($users, $fields);
  }
  /**
   * Modifying Meta fields for encryption.
   * @global type $wpdb
   * @param type $fields
   */
  private function _modifyMetaUserFields($fields) {
    $users = get_users();
    $meta_fields = $this->getMetaFields(TRUE);
    $this->_updateUser($users, $core_fields, FALSE);
    $users = get_users();
    $this->_updateUser($users, $fields);
    // Updating Meta fields.
    $this->_updateUserMeta($users, $meta_fields, FALSE);
    $this->_updateUserMeta($users, $fields);
  }
  /**
   * Updating Meta fields for user.
   * @param Object $users
   * @param Array $fields
   * @param Boolean $encrypt
   */
  private function _updateUserMeta($users, $fields, $encrypt = TRUE) {
    // If fields are not empty then update meta fields.
    if (!empty($fields)) {
      foreach ($users as $user) {
        foreach ($fields as $field_id){
          $field_id = str_replace("meta_", "", $field_id);
          $value = (($encrypt === TRUE) ? $this->encrypt($user->$field_id) : $this->decrypt($user->$field_id));
          update_user_meta($user->ID, $field_id, $value );
        }
      }
    }
  }
  /**
   * This method will update 
   * @global type $wpdb
   * @param type $users
   * @param type $fields
   * @param type $encrypt
   */
  private function _updateUser($users, $fields, $encrypt = TRUE) {
    if (!empty($fields)) {
      global $wpdb;
      foreach ($users as $user) {
        $query = "UPDATE " . $wpdb->prefix . "users SET ";
        foreach ($fields as $field_id){
          $query .= $field_id . " = '" . (($encrypt === TRUE) ? $this->encrypt($user->data->$field_id) : $this->decrypt($user->data->$field_id)) . "',";
        }
        $query = substr($query, 0, -1);
        $query .= " WHERE ID='" . $user->ID . "' ";
        // Executing Query.
        $wpdb->query($query);
      }
    }
  }
  /**
   * This method would return core fields.
   * @return type
   */
  public function getCoreFields() {
    $fields = $this->menu->getFields(TRUE);
    // Separating core fields. 
    return preg_grep("/meta_/i", $fields, PREG_GREP_INVERT);
  }

  /**
   * This method would return meta fields.
   * @return type
   */
  public function getMetaFields() {
    $fields = $this->menu->getFields(TRUE);
    // Separating core fields. 
    return preg_grep("/meta_/i", $fields);
    
    
  }

}
