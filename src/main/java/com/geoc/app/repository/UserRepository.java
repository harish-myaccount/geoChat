package com.geoc.app.repository;

import org.springframework.data.geo.Distance;
import org.springframework.data.geo.GeoResults;
import org.springframework.data.geo.Point;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import com.geoc.app.model.ConnectedUser;

public interface UserRepository extends MongoRepository<ConnectedUser, String>{

@Query("{'isChatting':false}")	
 public	GeoResults<ConnectedUser> findByLocationNear(Point point,Distance distance); 
}
